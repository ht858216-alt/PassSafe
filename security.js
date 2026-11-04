const COMMON_PASSWORDS = new Set([
  'password', 'password123', '123456', '123456789', 'qwerty',
  'qwerty123', 'admin', 'letmein', 'welcome', 'iloveyou',
  'abc123', '111111', '000000', 'passw0rd'
])

const has = {
  lower: value => /[a-z]/.test(value),
  upper: value => /[A-Z]/.test(value),
  number: value => /\d/.test(value),
  symbol: value => /[^A-Za-z0-9]/.test(value),
}

export function analyzePassword(password) {
  const checks = [
    { id: 'length', label: 'At least 12 characters', passed: password.length >= 12 },
    { id: 'upper', label: 'Uppercase letter (A–Z)', passed: has.upper(password) },
    { id: 'lower', label: 'Lowercase letter (a–z)', passed: has.lower(password) },
    { id: 'number', label: 'Number (0–9)', passed: has.number(password) },
    { id: 'symbol', label: 'Special character (!@#$…)', passed: has.symbol(password) },
    { id: 'variety', label: 'Not a common or repeated pattern', passed: password.length > 0 && !isCommonOrPredictable(password) },
  ]

  if (!password) return { score: 0, label: 'Not checked', tone: 'neutral', checks, entropy: 0 }

  const pool =
    (has.lower(password) ? 26 : 0) +
    (has.upper(password) ? 26 : 0) +
    (has.number(password) ? 10 : 0) +
    (has.symbol(password) ? 33 : 0)

  const entropy = pool ? password.length * Math.log2(pool) : 0
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (pool >= 36) score++
  if (pool >= 60) score++
  if (checks[5].passed) score++
  if (COMMON_PASSWORDS.has(password.toLowerCase())) score = 0
  if (/(.)\1{3,}/.test(password) || /^(?:1234|abcd|qwer)/i.test(password)) score = Math.min(score, 1)

  const normalized = Math.min(100, Math.round((score / 6) * 100))
  const label = normalized < 35 ? 'Weak' : normalized < 70 ? 'Fair' : normalized < 90 ? 'Strong' : 'Very strong'
  const tone = normalized < 35 ? 'weak' : normalized < 70 ? 'fair' : normalized < 90 ? 'strong' : 'excellent'
  return { score: normalized, label, tone, checks, entropy }
}

function isCommonOrPredictable(password) {
  const lower = password.toLowerCase()
  return COMMON_PASSWORDS.has(lower) ||
    /^(.)\1+$/.test(password) ||
    /^(0123|1234|2345|3456|4567|5678|6789|9876)/.test(password)
}

// Educational estimate only. This is not a prediction of a real attack.
export function estimateCrackTime(password, entropyBits) {
  if (!password) return '—'
  if (entropyBits < 15) return 'Seconds to minutes'
  if (entropyBits < 25) return 'Minutes to days'
  if (entropyBits < 35) return 'Days to months'
  if (entropyBits < 50) return 'Months to decades'
  if (entropyBits < 70) return 'Potentially centuries'
  return 'Extremely long under this model'
}

// Uses the HIBP Pwned Passwords range API (k-anonymity).
// Only the first five SHA-1 characters are sent; the full password is never sent.
export async function checkPasswordBreach(password) {
  if (!password) throw new Error('Enter a password first.')
  if (!globalThis.crypto?.subtle) throw new Error('Secure browser context required. Use localhost or HTTPS.')

  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-1', bytes)
  const hash = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
  const prefix = hash.slice(0, 5)
  const suffix = hash.slice(5)

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { 'Add-Padding': 'true' },
  })
  if (!response.ok) throw new Error('The breach-check service is unavailable. Try again later.')

  const body = await response.text()
  const match = body.split(/\r?\n/).map(line => line.trim().split(':')).find(([candidate]) => candidate === suffix)
  return match ? Number(match[1]) : 0
}

export function generatePassword(length = 18) {
  const alphabet = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*?'
  const values = new Uint32Array(length)
  crypto.getRandomValues(values)
  return Array.from(values, value => alphabet[value % alphabet.length]).join('')
}