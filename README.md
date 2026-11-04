# PassSafe — Password Strength & Breach Analyzer

A React + Vite single-page educational cybersecurity application. It analyzes password characteristics locally and optionally checks the password against the Have I Been Pwned (HIBP) Pwned Passwords corpus using its k-anonymity range API.

## Features

- Live strength score and strength label.
- Requirements checklist (length, uppercase, lowercase, numbers, symbols, predictable patterns).
- Educational guessing-resistance estimate. It is intentionally presented as a broad illustrative category, not a real-world guarantee.
- Optional breach check using HIBP Pwned Passwords range API.
- Strong password generator using the browser cryptographic random number generator.
- Responsive dark-luxury UI.
- No accounts, database, analytics, or password storage.

## Tech stack

- React
- Vite
- JavaScript
- CSS
- Web Crypto API
- HIBP Pwned Passwords range API

## Run locally

Install Node.js (LTS), then:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

Create a production build:

```bash
npm run build
npm run preview
```

## Breach-check privacy

The local analyzer does not send the password anywhere. When the user explicitly presses **Check exposure**, the app computes a SHA-1 hash in the browser, sends only its first five hexadecimal characters to `https://api.pwnedpasswords.com/range/{prefix}`, then compares the returned suffixes locally. The full password and full hash are not sent by this application.

The API uses the k-anonymity range model. The remote service still receives the partial hash prefix and normal request metadata such as IP address. The app should be served over HTTPS in production.

HIBP Pwned Passwords checks password exposure, not whether an email address was involved in a breach. HIBP's email/account search is a separate service and generally requires an API key; this project does not pretend to perform an email breach lookup.

## Important limitations

- The strength score is a learning aid, not a formal password audit. It does not replace a reputable password manager or modern password-strength estimator.
- Guessing-resistance wording is a broad educational estimate. Actual attack time depends on attacker resources, password hashing, rate limits, leaked patterns, and other factors.
- A “no match” breach result does not prove a password has never been exposed.
- Do not enter a password that you currently use for an important account into a classroom demo. Use a made-up test password.

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. Sign in to Vercel and choose **Add New → Project**.
3. Import the GitHub repository.
4. Framework preset: **Vite**.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Deploy. Vercel will provide a public HTTPS URL.

No environment variables are required for this frontend-only version.

## Project structure

```text
PassSafe/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── security.js
    └── style.css
```

## Suggested manual test cases

1. Empty input: score is 0 and checklist is pending.
2. `hello123`: lowercase and number requirements pass; uppercase and symbol do not.
3. A long mixed-character test password: score should increase.
4. A common password such as `password123`: it should be treated as weak.
5. Click Generate strong password: a random password is generated; clipboard copy may require a secure context.
6. Click Check exposure: the app shows a match count or a service/network error.

## Academic note

This project is an educational demonstration. It is not a substitute for a professional security audit, and it does not attempt to crack, collect, or store user passwords.
