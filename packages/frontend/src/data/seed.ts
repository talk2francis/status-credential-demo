export const users = [
  {
    id: 'user-student-1',
    name: 'Amina Iroh',
    email: 'amina.student@statuscredential.io',
    walletAddresses: ['0x1234...ABCD'],
    role: 'student',
    xp: 1240,
    referrals: ['ref-001', 'ref-002']
  },
  {
    id: 'user-instructor-1',
    name: 'Leo Fernandez',
    email: 'leo.instructor@statuscredential.io',
    walletAddresses: ['0x9876...FFFF'],
    role: 'instructor',
    xp: 4820,
    referrals: []
  }
]

export const courses = [
  {
    id: 'course-crypto-fundamentals',
    title: 'Crypto Fundamentals',
    summary: 'Master the basics of blockchain, wallets, and security with guided micro-lessons.',
    tags: ['beginner', 'wallets', 'security'],
    instructorId: 'user-instructor-1',
    price: 'free',
    difficulty: 'Beginner',
    duration: '3h runtime',
    publishState: 'published',
    cover: '/covers/fundamentals.png'
  },
  {
    id: 'course-defi-mechanisms',
    title: 'DeFi Mechanisms',
    summary: 'Intermediate deep dive into AMMs, LP strategies, and on-chain automation.',
    tags: ['defi', 'intermediate', 'amm'],
    instructorId: 'user-instructor-1',
    price: 'paid',
    difficulty: 'Intermediate',
    duration: '6h runtime',
    publishState: 'published',
    cover: '/covers/defi.png'
  }
]

export const lessons = [
  {
    id: 'lesson-money',
    courseId: 'course-crypto-fundamentals',
    type: 'article',
    contentUrl: '#',
    durationSec: 180,
    quizId: 'quiz-fundamentals'
  },
  {
    id: 'lesson-blockchains',
    courseId: 'course-crypto-fundamentals',
    type: 'video',
    contentUrl: '#',
    durationSec: 420
  },
  {
    id: 'lesson-wallets',
    courseId: 'course-crypto-fundamentals',
    type: 'interactive',
    contentUrl: '#',
    durationSec: 360,
    quizId: 'quiz-fundamentals'
  },
  {
    id: 'lesson-amms',
    courseId: 'course-defi-mechanisms',
    type: 'video',
    contentUrl: '#',
    durationSec: 600
  },
  {
    id: 'lesson-yields',
    courseId: 'course-defi-mechanisms',
    type: 'article',
    contentUrl: '#',
    durationSec: 720
  },
  {
    id: 'lesson-dca-project',
    courseId: 'course-defi-mechanisms',
    type: 'project',
    contentUrl: '#',
    durationSec: 900
  }
]

export const quizzes = [
  {
    id: 'quiz-fundamentals',
    items: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What makes blockchains trustless?',
        choices: ['Smart contracts', 'Decentralized consensus', 'Cold wallets', 'Stablecoins'],
        answer: 'Decentralized consensus'
      }
    ],
    passingScore: 80
  },
  {
    id: 'quiz-defi',
    items: [
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'Impermanent loss is best described as…',
        choices: ['Loss from fraud', 'Temporary divergence between pooled assets', 'Gas fee spikes', 'Loan defaults'],
        answer: 'Temporary divergence between pooled assets'
      }
    ],
    passingScore: 80
  }
]

export const leaderboard = Array.from({ length: 10 }).map((_, index) => ({
  id: `leader-${index + 1}`,
  name: `Trader ${index + 1}`,
  xp: 1000 - index * 75,
  trades: 25 + index * 3
}))
