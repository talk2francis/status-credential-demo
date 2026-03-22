# Status Credential Demo Feature Blueprint

## 1. Screens & Components

| Screen | Components | State shape | API example | Copy / CTA / Empty states |
| --- | --- | --- | --- | --- |
| Landing / Campaign hero | HeroBanner, ValuePropGrid, InstructorStrip, CountdownTimer, CTA buttons | `{ countdown: { days, hours, minutes }, stats: { instructors, trades, shareRate } }` | `GET /api/analytics/campaign` → `{ countdown: 1080, stats: { instructors: 32, trades: 12000, shareRate: 0.89 } }` | Headline: "Learn crypto by doing. Courses built by practitioners." CTA Primary: "Browse courses". Secondary: "Open sandbox". Empty: "Campaign data syncing…" |
| Catalog / Search | FilterSidebar, SearchToolbar, CourseCard, QuickPreviewModal | `{ filters: { topic[], difficulty[], format[], duration }, query: string }` | `GET /api/courses?query=wallet&tags=security&difficulty=Beginner` → `{ data: Course[], total }` | Error copy: "Unable to load courses. Retry." Empty: "No tracks match your filters." |
| Course detail | InstructorBlock, CurriculumTimeline, SandboxCTA, AuthenticityReelCard | `{ course, lessons, authenticityReel }` | `GET /api/courses/:id` | CTA: free course → "Start for free"; paid → "Preview lesson" + "Enroll now". Empty curriculum: "Lessons publish after instructor review." |
| Course player | VideoPlayer, TranscriptPanel, InlineQuiz, ProgressSidebar, ShareWidget | `{ activeLesson, transcript, quizState, progress }` | `GET /api/users/:id/progress` | Error: "We lost the lesson stream. Refresh." Share button copy: "Generate social card" |
| Sandbox simulator | WalletBanner, OrderEntryForm, OrderBook, PortfolioWidget, TradeReplay | `{ wallet: { connected, address, balance }, orders: [], replayIndex }` | `POST /api/sandbox/trade` | CTA: "Submit paper trade". Error: "Sandbox offline — using fallback prices." |
| Assessment & certificate | QuizPanel, ProjectUpload, CertificateModal, ShareActions | `{ quiz: Quiz, submission: { status }, certificate }` | `POST /api/certificates/generate` | CTA: "Generate social card". Error: "Certificate renderer busy, retry." |
| Instructor dashboard | LessonUploader, EngagementHeatmap, AuthenticityQueue, ReferralLeaderboard | `{ uploads, heatmap, reelsQueue, referrals }` | `GET /api/dashboard/instructor` | Empty: "No lessons uploaded — drop files to start." |
| Admin metrics | FunnelChart, ViralStats, PrivacyPanel, DataDeletionCTA | `{ funnel, virality, privacyRequests }` | `GET /api/dashboard/admin` | Copy: "Need data removed? Contact privacy@statuscredential.io" |

## 2. Data models

```ts
interface User { id: string; name: string; email: string; walletAddresses: string[]; role: 'student'|'instructor'|'admin'; xp: number; referrals: string[] }
interface Course { id: string; title: string; summary: string; tags: string[]; instructorId: string; lessons: string[]; price: 'free'|'paid'; publishState: 'draft'|'published'; difficulty: 'Beginner'|'Intermediate'|'Advanced' }
interface Lesson { id: string; courseId: string; type: 'video'|'interactive'|'article'|'project'; contentUrl: string; durationSec: number; quizId?: string }
interface Quiz { id: string; items: QuizItem[]; passingScore: number }
interface SandboxTrade { id: string; userId: string; timestamp: string; symbol: string; side: 'BUY'|'SELL'; qty: number; price: number; pnl: number }
interface Certificate { id: string; userId: string; courseId: string; issuedAt: string; certUrl: string; socialCardUrl: string }
interface AnalyticsEvent { id: string; userId?: string; type: string; meta: Record<string, unknown>; createdAt: string }
```

## 3. Lesson scripts (≈1 min each)

1. **What is money?** — origin of value, commodity vs fiat, programmable assets.
2. **How blockchains work** — distributed ledgers, consensus, block finality.
3. **Wallets and security** — seed phrases, hot vs cold storage, threat modeling.
4. **AMMs and liquidity pools** — constant product formula, pool shares, fees.
5. **Yield farming** — stacking rewards, impermanent loss mitigation, vaults.
6. **Mock DCA strategy** — configuring sandbox trades, evaluating pnl, recording reflections.

Scripts elaborated in `docs/lesson-scripts.md` (see file).

## 4. Quiz bank (10 Qs)

Located in `docs/assessments.md`: includes MCQs with answers plus rubric for DCA project (criteria: strategy logic 40%, trade execution 30%, reflection 30%).

## 5. Sandbox flows
- Wallet connect → `POST /api/auth/wallet-login`
- Submit trade → `POST /api/sandbox/trade`
- XP sync → `GET /api/users/:id/progress`
- Replay history draws from `GET /api/sandbox/trades?userId=` (to be implemented).

## 6. Certificates & social kit
- `POST /api/certificates/generate` returns `{ pdfBase64, socialCardBase64 }`
- Social tweets (tokenized):
  - Short: "Finished [Course Title] on Status Credential Demo. Learned real tactics, not buzzwords. #CryptoEducation"
  - Story: "Week 2 of my #CryptoEducation sprint → [Course Title]. Sandbox trades finally clicked."
  - Referral CTA: "Enroll via my Status Credential Demo link [ReferralURL] and unlock bonus XP." 
- Social card template 1200×630 with student avatar left, stats right.

## 7. Novel feature — Authenticity Reel
- Endpoint `POST /api/reels/generate` (mock) → returns `.mp4` placeholder
- Inputs: `instructorId`, `prompts[] = ['origin story', 'office hours', 'project highlight']`
- Output includes storyboard, captions, audio transcript (see `docs/reels.json`).

## 8. Accessibility & i18n
- WCAG AA color contrast tokens defined in `packages/frontend/src/styles/tokens.ts`
- Locale files: en, es, fr placeholder.
- Keyboard focus ring defined globally.

## 9. Analytics & instrumentation
- Frontend emits `AnalyticsEvent` via `/api/events`
- Debug dashboard (local) streams events in instructor view.

## 10. Packaging for judges
- README instructions
- `npm run demo:init`
- Provide zipped export via `npm run export:bundle` (TODO script).
