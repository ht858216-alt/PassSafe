import { useMemo, useState } from 'react'
import { analyzePassword, checkPasswordBreach, estimateCrackTime, generatePassword } from './security'

function Icon({ name }) {
  const icons = {
    shield: '⬡', lock: '▣', eye: '◉', eyeOff: '◎', check: '✓',
    alert: '!', clock: '◷', search: '⌕', spark: '✦', copy: '▢',
    arrow: '↗', refresh: '↻', github: '⌘'
  }
  return <span aria-hidden="true" className="icon">{icons[name] || '•'}</span>
}

function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="#home" aria-label="PassSafe home">
        <span className="brand-mark"><Icon name="shield" /></span>
        <span>Pass<span>Safe</span></span>
      </a>
      <nav>
        <a href="#analyzer">Analyzer</a>
        <a href="#how-it-works">How it works</a>
        <a href="#privacy">Privacy</a>
      </nav>
      <a className="nav-cta" href="#analyzer">Check password <Icon name="arrow" /></a>
    </header>
  )
}

function Meter({ score, tone }) {
  return (
    <div className={`meter meter-${tone}`}>
      <div className="meter-track"><div className="meter-fill" style={{ width: `${score}%` }} /></div>
      <div className="meter-labels"><span>WEAK</span><span>FAIR</span><span>STRONG</span><span>VERY STRONG</span></div>
    </div>
  )
}

export default function App() {
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [breach, setBreach] = useState({ status: 'idle', count: 0, message: '' })
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => analyzePassword(password), [password])
  const crackTime = estimateCrackTime(password, result.entropy)

  function updatePassword(value) {
    setPassword(value)
    setBreach({ status: 'idle', count: 0, message: '' })
    setCopied(false)
  }

  async function runBreachCheck() {
    if (!password) {
      setBreach({ status: 'error', count: 0, message: 'Enter a password before checking.' })
      return
    }
    setBreach({ status: 'loading', count: 0, message: '' })
    try {
      const count = await checkPasswordBreach(password)
      setBreach({
        status: 'done',
        count,
        message: count > 0
          ? `This password appeared ${count.toLocaleString()} times in the Pwned Passwords dataset.`
          : 'No match found in the Pwned Passwords dataset.',
      })
    } catch (error) {
      setBreach({ status: 'error', count: 0, message: error.message })
    }
  }

  async function copyGenerated() {
    const value = generatePassword()
    updatePassword(value)
    setVisible(true)
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="app-shell" id="home">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <Header />

      <main>
        <section className="hero">
          <div className="eyebrow"><span className="pulse-dot" /> PERSONAL PASSWORD SECURITY</div>
          <h1>Your passwords.<br /><span>Stronger by design.</span></h1>
          <p className="hero-copy">Understand your password strength, spot common weaknesses, and check known exposure — with privacy at the center.</p>
          <div className="hero-points">
            <span><Icon name="check" /> Instant analysis</span>
            <span><Icon name="check" /> Privacy-first check</span>
            <span><Icon name="check" /> No password storage</span>
          </div>
        </section>

        <section className="workspace" id="analyzer">
          <div className="section-heading">
            <div><span className="section-kicker">PASSWORD ANALYZER</span><h2>Test your password</h2></div>
            <span className="live-tag"><span className="pulse-dot" /> LIVE ANALYSIS</span>
          </div>

          <div className="main-grid">
            <div className="panel input-panel">
              <div className="panel-title"><span className="panel-icon"><Icon name="lock" /></span><div><h3>Enter a password</h3><p>Analysis runs locally in your browser.</p></div></div>
              <label className="field-label" htmlFor="password">PASSWORD</label>
              <div className="password-field">
                <input
                  id="password"
                  type={visible ? 'text' : 'password'}
                  value={password}
                  onChange={event => updatePassword(event.target.value)}
                  placeholder="Type a password to analyze..."
                  autoComplete="new-password"
                  spellCheck="false"
                />
                <button className="icon-button" type="button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide password' : 'Show password'}>
                  <Icon name={visible ? 'eyeOff' : 'eye'} />
                </button>
              </div>
              <div className="field-actions">
                <span className="privacy-note"><Icon name="shield" /> Never stored or logged</span>
                <button className="text-button" type="button" onClick={copyGenerated}><Icon name="spark" /> Generate strong password</button>
              </div>
              {copied && <p className="inline-success">Generated password copied to clipboard.</p>}

              <div className="divider" />
              <div className="strength-row"><div><span className="field-label">STRENGTH SCORE</span><div className={`strength-name tone-${result.tone}`}>{result.label}</div></div><div className="score"><strong>{result.score}</strong><span>/100</span></div></div>
              <Meter score={result.score} tone={result.tone} />
              <div className="estimate-card">
                <div className="estimate-icon"><Icon name="clock" /></div>
                <div><span className="field-label">ESTIMATED GUESSING RESISTANCE</span><strong>{crackTime}</strong><small>Illustrative estimate, not a guarantee.</small></div>
              </div>
            </div>

            <div className="panel checklist-panel">
              <div className="panel-title"><span className="panel-icon purple"><Icon name="check" /></span><div><h3>Security checklist</h3><p>Requirements update as you type.</p></div></div>
              <div className="check-list">
                {result.checks.map(item => (
                  <div className={`check-item ${item.passed ? 'passed' : ''}`} key={item.id}>
                    <span className="check-circle">{item.passed ? <Icon name="check" /> : '·'}</span>
                    <span>{item.label}</span>
                    <span className="check-state">{item.passed ? 'MET' : 'PENDING'}</span>
                  </div>
                ))}
              </div>
              <div className="tip-box"><span className="tip-star"><Icon name="spark" /></span><div><strong>Security tip</strong><p>Use a unique passphrase or a password manager. Avoid reusing passwords across accounts.</p></div></div>
            </div>
          </div>

          <div className="panel breach-panel">
            <div className="breach-copy">
              <div className="panel-title"><span className="panel-icon amber"><Icon name="search" /></span><div><h3>Known breach check</h3><p>Check whether this password appears in known breach data.</p></div></div>
              <p className="breach-description">PassSafe uses the Pwned Passwords range API. Only a partial hash prefix is sent — never the password itself.</p>
            </div>
            <div className="breach-action">
              <button className="primary-button" type="button" onClick={runBreachCheck} disabled={!password || breach.status === 'loading'}>
                {breach.status === 'loading' ? 'Checking…' : 'Check exposure'} <Icon name="arrow" />
              </button>
              {breach.status === 'done' && <div className={`breach-result ${breach.count ? 'exposed' : 'safe'}`}><strong>{breach.count ? 'Exposure found' : 'No match found'}</strong><span>{breach.message}</span></div>}
              {breach.status === 'error' && <div className="breach-result exposed"><strong>Could not complete check</strong><span>{breach.message}</span></div>}
            </div>
          </div>
          <p className="api-footnote">Breach lookup requires an internet connection. A “no match” result does not prove a password has never been exposed.</p>
        </section>

        <section className="info-section" id="how-it-works">
          <div className="section-heading"><div><span className="section-kicker">BUILT FOR CLARITY</span><h2>Security, made understandable.</h2></div></div>
          <div className="info-grid">
            <article className="info-card"><span className="info-number">01</span><span className="info-icon"><Icon name="spark" /></span><h3>Analyze instantly</h3><p>Strength and checklist feedback are calculated in your browser as you type.</p></article>
            <article className="info-card"><span className="info-number">02</span><span className="info-icon"><Icon name="shield" /></span><h3>Check exposure safely</h3><p>The breach check uses a partial SHA-1 hash prefix through the k-anonymity range API.</p></article>
            <article className="info-card"><span className="info-number">03</span><span className="info-icon"><Icon name="lock" /></span><h3>Privacy comes first</h3><p>PassSafe does not create accounts, store passwords, or send them to its own server.</p></article>
          </div>
        </section>

        <section className="privacy-banner" id="privacy">
          <span className="privacy-large"><Icon name="shield" /></span>
          <div><span className="section-kicker">YOUR DATA STAYS YOURS</span><h2>Designed with privacy in mind.</h2><p>Password analysis happens locally. For the optional breach lookup, only the first five characters of the password's SHA-1 hash are sent to the Pwned Passwords service.</p></div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#home"><span className="brand-mark"><Icon name="shield" /></span><span>Pass<span>Safe</span></span></a>
        <span>Educational security tool · Use unique passwords for every account.</span>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  )
}
