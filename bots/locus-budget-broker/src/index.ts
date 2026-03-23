import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';
import { z } from 'zod';
import { appendFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const LOCUS_API_KEY = process.env.LOCUS_API_KEY;

if (!BOT_TOKEN || !LOCUS_API_KEY) {
  throw new Error('Missing TELEGRAM_BOT_TOKEN or LOCUS_API_KEY in environment.');
}

const DEFAULT_AUDIT_PATH = path.resolve(process.cwd(), '../../data/locus-audit-log.jsonl');
const AUDIT_LOG_PATH = path.resolve(
  process.cwd(),
  process.env.AUDIT_LOG_PATH ?? DEFAULT_AUDIT_PATH
);
const ESTIMATED_COST = Number(process.env.LOCUS_ESTIMATED_COST ?? '0.01');
const MIN_RESERVE = Number(process.env.LOCUS_MIN_RESERVE ?? '1');

const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

const bot = new Telegraf(BOT_TOKEN);

interface PendingIntent {
  id: string;
  chatId: number;
  username?: string;
  email: string;
  estimatedCost: number;
}

const pendingIntents = new Map<string, PendingIntent>();

async function ensureAuditDir() {
  try {
    await access(AUDIT_LOG_PATH);
  } catch {
    await mkdir(path.dirname(AUDIT_LOG_PATH), { recursive: true });
  }
}

async function appendAudit(entry: Record<string, unknown>) {
  await ensureAuditDir();
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...entry,
  });
  await appendFile(AUDIT_LOG_PATH, line + '\n', 'utf8');
}

async function callLocus<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Authorization': `Bearer ${LOCUS_API_KEY}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Locus API error (${res.status}): ${text}`);
  }

  const json = await res.json();
  if (json?.success === false) {
    throw new Error(json?.message || 'Unknown Locus API error');
  }
  return json?.data ?? json;
}

async function fetchBalance() {
  const data = await callLocus<{ usdc_balance: string; wallet_address: string }>(
    'https://beta-api.paywithlocus.com/api/pay/balance'
  );
  return {
    balance: Number(data.usdc_balance ?? '0'),
    wallet: data.wallet_address,
  };
}

async function runEmailReputation(email: string) {
  const data = await callLocus<any>(
    'https://beta-api.paywithlocus.com/api/wrapped/abstract-email-reputation/check',
    {
      method: 'POST',
      body: JSON.stringify({ email }),
    }
  );
  return data;
}

function formatResult(data: any) {
  const score = data?.email_quality?.score ?? 0;
  const deliverability = data?.email_deliverability?.status ?? 'unknown';
  const addressRisk = data?.email_risk?.address_risk_status ?? 'unknown';
  const domainRisk = data?.email_risk?.domain_risk_status ?? 'unknown';

  return `📧 *Email:* ${data?.email_address}
• Deliverability: *${deliverability}*
• Address risk: *${addressRisk}*
• Domain risk: *${domainRisk}*
• Quality score: *${score}*`;
}

bot.start(async (ctx) => {
  await ctx.reply(
    'Hi! I am the Locus Budget Broker. Send `/check email@example.com` and I will estimate the cost, ask for approval, pay via Locus, and log everything with the on-chain wallet. '
    + `\n\nCurrent budget: ${MIN_RESERVE}+ USDC reserved for guardrails. Each email reputation check costs about $${ESTIMATED_COST.toFixed(3)}.`
  );
});

bot.command('check', async (ctx) => {
  const text = ctx.message.text;
  const match = text.match(EMAIL_REGEX);
  if (!match) {
    await ctx.reply('Please include a valid email address, e.g., `/check scam@example.com`.');
    return;
  }

  const email = match[0].toLowerCase();
  const { balance } = await fetchBalance();
  if (balance < ESTIMATED_COST + MIN_RESERVE) {
    await ctx.reply(
      `Balance too low to run this check. Need at least $${(ESTIMATED_COST + MIN_RESERVE).toFixed(2)} available.`
    );
    return;
  }

  const intentId = crypto.randomUUID();
  pendingIntents.set(intentId, {
    id: intentId,
    chatId: ctx.chat.id,
    username: ctx.from?.username,
    email,
    estimatedCost: ESTIMATED_COST,
  });

  await ctx.reply(
    `Plan: run Locus Email Reputation for *${email}* (estimated $${ESTIMATED_COST.toFixed(3)}). Approve?`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        Markup.button.callback('✅ Approve', `approve:${intentId}`),
        Markup.button.callback('❌ Cancel', `cancel:${intentId}`),
      ]),
    }
  );
});

bot.action(/approve:(.+)/, async (ctx) => {
  const intentId = ctx.match[1];
  const intent = pendingIntents.get(intentId);
  await ctx.answerCbQuery();

  if (!intent) {
    await ctx.reply('This approval link has expired. Start again with /check.');
    return;
  }

  try {
    const { balance, wallet } = await fetchBalance();
    if (balance < intent.estimatedCost + MIN_RESERVE) {
      throw new Error(
        `Balance ${balance.toFixed(2)} is below reserve. Please top up to keep at least $${MIN_RESERVE.toFixed(2)}.`
      );
    }

    await ctx.reply(`Running email reputation on ${intent.email}…`);
    const before = balance;
    const result = await runEmailReputation(intent.email);
    const afterState = await fetchBalance();
    const actualCost = Math.max(0, before - afterState.balance);

    pendingIntents.delete(intentId);

    const formatted = formatResult(result);
    await ctx.replyWithMarkdown(
      `${formatted}\n\n✅ Paid via Locus wallet ${wallet}. Cost: $${actualCost.toFixed(3)}. Remaining balance: $${afterState.balance.toFixed(2)}.`
    );

    await appendAudit({
      intentId,
      email: intent.email,
      wallet,
      estimatedCost: intent.estimatedCost,
      actualCost,
      balanceBefore: before,
      balanceAfter: afterState.balance,
      resultSummary: {
        deliverability: result?.email_deliverability?.status,
        addressRisk: result?.email_risk?.address_risk_status,
      },
    });
  } catch (error) {
    pendingIntents.delete(intentId);
    const message = error instanceof Error ? error.message : 'Unknown error';
    await ctx.reply(`❌ Failed to complete the check: ${message}`);
    await appendAudit({
      intentId,
      email: intent.email,
      status: 'error',
      error: message,
    });
  }
});

bot.action(/cancel:(.+)/, async (ctx) => {
  const intentId = ctx.match[1];
  pendingIntents.delete(intentId);
  await ctx.answerCbQuery('Cancelled');
  await ctx.reply('Cancelled. Start again with /check when you’re ready.');
});

bot.on('text', async (ctx) => {
  if (!ctx.message.text.startsWith('/')) {
    await ctx.reply('Send `/check email@example.com` to run an email reputation check.');
  }
});

bot.catch(async (err, ctx) => {
  console.error('Bot error', err);
  await ctx.reply('Something went wrong. Please try again later.');
});

bot.launch().then(() => {
  console.log('Locus Budget Broker bot started.');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
