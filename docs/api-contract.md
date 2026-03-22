# API Contract Examples

## GET /api/courses
**Request:** `/api/courses?query=wallet&tags=security&difficulty=Beginner`
**Response:**
```json
{
  "data": [
    {
      "id": "course-crypto-fundamentals",
      "title": "Crypto Fundamentals",
      "summary": "Master the basics of blockchain, wallets, and security.",
      "tags": ["beginner", "wallets", "security"],
      "instructorId": "user-instructor-1",
      "price": "free",
      "publishState": "published"
    }
  ],
  "total": 1
}
```

## GET /api/courses/:id
```json
{
  "id": "course-crypto-fundamentals",
  "title": "Crypto Fundamentals",
  "summary": "Master the basics...",
  "lessons": [
    { "id": "lesson-money", "type": "article", "durationSec": 180 },
    { "id": "lesson-blockchains", "type": "video", "durationSec": 420 }
  ]
}
```

## POST /api/auth/magic-link
```json
{
  "email": "amina.student@statuscredential.io"
}
→ { "message": "Magic link emailed (mock)", "email": "amina.student@statuscredential.io" }
```

## POST /api/auth/wallet-login
```json
{
  "walletAddress": "0x1234...ABCD"
}
→ { "sessionToken": "mock-session", "chain": "sepolia-testnet" }
```

## POST /api/sandbox/trade
```json
{
  "userId": "user-student-1",
  "symbol": "ETH/USDC",
  "side": "BUY",
  "qty": 0.5,
  "price": 3250
}
→ {
  "trade": { "id": "trade-3", "symbol": "ETH/USDC", "side": "BUY", "qty": 0.5, "price": 3250, "pnl": 0 },
  "portfolio": { "cash": 10000, "holdings": [{ "symbol": "ETH/USDC", "qty": 0.75 }] }
}
```

## GET /api/users/:id/progress
```json
{
  "user": { "id": "user-student-1", "xp": 1240 },
  "progress": { "percent": 0.58, "xp": 1240 }
}
```

## POST /api/courses/:id/submit-project
```json
{
  "userId": "user-student-1",
  "artifactUrl": "https://example.com/dca-notion",
  "summary": "3-step DCA cadence"
}
→ { "status": "received", "projectId": "project-1710853600" }
```

## POST /api/certificates/generate
```json
{
  "userId": "user-student-1",
  "courseId": "course-crypto-fundamentals"
}
→ {
  "id": "cert-1710853600",
  "certUrl": "data:application/pdf;base64,MOCK",
  "socialCardUrl": "data:image/png;base64,MOCK"
}
```
