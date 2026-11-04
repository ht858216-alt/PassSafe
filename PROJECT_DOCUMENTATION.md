# PassSafe — Project Documentation

## 1. Overview
PassSafe is a single-page web application that helps users understand password quality. It provides immediate feedback on password length and character variety, identifies common patterns, gives an illustrative resistance category, and offers an optional known-password exposure lookup.

## 2. Problem statement
People often choose short, reused, or predictable passwords and may not understand why these choices are risky. PassSafe presents understandable feedback in one place and explains the privacy limits of its breach lookup.

## 3. Objectives
- Explain password quality in an accessible way.
- Encourage long, unique passwords.
- Demonstrate browser-side password analysis.
- Demonstrate privacy-conscious breach checking with k-anonymity.
- Publish a working web application to a cloud hosting provider.

## 4. Main modules
### Password Analyzer
`analyzePassword()` checks length, uppercase, lowercase, digits, symbols, common passwords, and simple predictable patterns. It returns a score, label, checklist, and rough entropy estimate.

### Guessing Resistance Estimator
`estimateCrackTime()` maps the educational entropy estimate to broad categories. The displayed result is not a promise of actual cracking time.

### Breach Risk Checker
`checkPasswordBreach()` computes SHA-1 using Web Crypto, sends only the first five hash characters to the HIBP Pwned Passwords range endpoint, and compares the returned suffixes locally.

### Password Generator
`generatePassword()` uses `crypto.getRandomValues()` to select characters for a generated password.

## 5. Privacy and security design
- No password database or account system.
- No password persistence in local storage.
- No password sent to a PassSafe backend.
- Breach lookup is user-triggered.
- Only a partial SHA-1 prefix is sent to the HIBP range endpoint.
- Use HTTPS in deployment.
- Demonstration users should use made-up passwords, not current account credentials.

## 6. Architecture
Browser UI (React Components) → local JavaScript analysis functions.
For optional breach lookup: Browser Web Crypto → partial hash prefix → HIBP range API → local suffix comparison → result shown in UI.

## 7. Testing
Manual tests are listed in README.md. Test both normal behavior and network failure behavior.

## 8. Limitations and future improvements
- Add a formal password estimator library after evaluating its licensing and maintenance.
- Add automated unit tests.
- Add a separately configured email-breach feature only if the team obtains an authorized API key and handles it server-side; do not expose secret API keys in frontend code.
- Add accessibility review and browser compatibility tests.

## 9. Conclusion
PassSafe demonstrates frontend development, JavaScript logic, browser cryptography, third-party API integration, privacy awareness, and cloud deployment in one focused application.
