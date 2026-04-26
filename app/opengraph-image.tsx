import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'JAY — Fullstack Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'monospace',
        }}
      >
        {/* Left: text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
          <div
            style={{
              fontSize: '18px',
              color: '#666',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Portfolio
          </div>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            JAY
          </div>
          <div
            style={{
              fontSize: '28px',
              color: '#aaa',
              lineHeight: 1.4,
            }}
          >
            Fullstack Developer
          </div>
          <div
            style={{
              fontSize: '18px',
              color: '#555',
              marginTop: '8px',
            }}
          >
            Web · Mobile · AI · Ecommerce
          </div>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '16px',
            }}
          >
            {['Next.js', 'React Native', 'AI', 'Mongolia'].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '6px 16px',
                  border: '1px solid #333',
                  borderRadius: '4px',
                  color: '#888',
                  fontSize: '14px',
                  letterSpacing: '0.05em',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Right: avatar */}
        <div
          style={{
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #333',
            flexShrink: 0,
            marginLeft: '80px',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://raw.githubusercontent.com/jayslifecode/my-portfolio/main/public/avatar.png"
            width={280}
            height={280}
            alt="JAY"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}
