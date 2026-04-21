'use client'

export default function NavBar() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.55rem',
            color: 'var(--ember)',
            animation: 'cursor-blink 1.1s step-end infinite',
          }}
        >
          ▶
        </span>
        <span
          style={{
            fontFamily: 'var(--font-oxanium), sans-serif',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: '#ffffff',
          }}
        >
          JAY.EXE
        </span>
        <span
          style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.5rem',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          v1.0
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {[
          { label: '[ WORK ]', href: '#work' },
          { label: '[ CONTACT ]', href: '#contact' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.3)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--ember)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'
            }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Version stamp */}
      <span
        style={{
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '0.5rem',
          letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.12)',
        }}
      >
        2026 · MN
      </span>
    </nav>
  )
}
