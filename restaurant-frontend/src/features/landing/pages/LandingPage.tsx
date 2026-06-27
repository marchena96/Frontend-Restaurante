import { useNavigate } from '@tanstack/react-router'

const palette = {
  lightGray: '#BBBFBF',
  mediumGray: '#878787',
  teal: '#05AD98',
  white: '#FFFFFF',
  dark: 'var(--panel)',
  darker: 'var(--bg-subtle)',
  darkest: 'var(--bg)',
}

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={palette.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Gestion Integral',
    description: 'Control total del salon, mesas, reservaciones y turnos en una sola plataforma.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={palette.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Tiempo Real',
    description: 'Metricas en vivo, cola de espera automatica y actualizaciones instantaneas.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={palette.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Experiencia del Comensal',
    description: 'Reservaciones fluidas, espera inteligente y servicio personalizado.',
  },
]

const stats = [
  { value: '24', label: 'Mesas Activas' },
  { value: '128', label: 'Comensales Registrados' },
  { value: '36', label: 'Reservas Hoy' },
  { value: '99%', label: 'Satisfaccion' },
]

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: palette.darkest, minHeight: '100vh', color: palette.white }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(13, 13, 13, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid rgba(255,255,255,0.06)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 6,
            background: palette.teal,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 700,
            fontSize: 15,
            color: palette.white,
            letterSpacing: '0.05em',
          }}>
            RE
          </div>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}>
            Restaurante Enterprise
          </span>
        </div>
        <button
          onClick={() => navigate({ to: '/login' })}
          style={{
            background: 'transparent',
            border: `1px solid rgba(255,255,255,0.15)`,
            color: palette.white,
            padding: '8px 20px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 200ms ease',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = palette.teal
            e.currentTarget.style.color = palette.teal
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
            e.currentTarget.style.color = palette.white
          }}
        >
          Iniciar Sesion
        </button>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(5, 173, 152, 0.08) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '100px',
          border: `1px solid rgba(5, 173, 152, 0.3)`,
          background: 'rgba(5, 173, 152, 0.06)',
          color: palette.teal,
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          marginBottom: 32,
        }}>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: palette.teal,
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          Sistema Operativo de Sala
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: 300,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          margin: '0 0 24px',
          maxWidth: '800px',
        }}>
          Control Total de{' '}
          <span style={{
            fontWeight: 600,
            background: `linear-gradient(135deg, ${palette.teal}, #07c9a8)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Tu Restaurante
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: palette.mediumGray,
          maxWidth: '520px',
          lineHeight: 1.6,
          margin: '0 0 48px',
        }}>
          Administra mesas, reservaciones, turnos y comensales desde un solo panel.
          Diseno profesional para operaciones exigentes.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate({ to: '/login' })}
            style={{
              background: palette.teal,
              border: 'none',
              color: palette.white,
              padding: '14px 32px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 200ms ease',
              fontFamily: 'inherit',
              boxShadow: `0 4px 24px rgba(5, 173, 152, 0.25)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(5, 173, 152, 0.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(5, 173, 152, 0.25)'
            }}
          >
            Acceder al Panel
          </button>
          <button
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              background: 'transparent',
              border: `1px solid rgba(255,255,255,0.12)`,
              color: palette.lightGray,
              padding: '14px 32px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 200ms ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
              e.currentTarget.style.color = palette.white
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.color = palette.lightGray
            }}
          >
            Conocer Mas
          </button>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          color: palette.mediumGray,
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          animation: 'float 3s ease-in-out infinite',
        }}>
          <div style={{
            width: 1,
            height: 32,
            background: `linear-gradient(180deg, ${palette.mediumGray}, transparent)`,
          }} />
        </div>
      </section>

      {/* Stats */}
      <section style={{
        padding: '80px 48px',
        borderTop: `1px solid rgba(255,255,255,0.06)`,
        borderBottom: `1px solid rgba(255,255,255,0.06)`,
        background: palette.darker,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '48px',
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 48,
                fontWeight: 600,
                color: palette.teal,
                lineHeight: 1,
                marginBottom: 8,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: 13,
                color: palette.mediumGray,
                letterSpacing: '0.05em',
                textTransform: 'uppercase' as const,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{
        padding: '120px 48px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span style={{
            fontSize: 12,
            color: palette.teal,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            fontWeight: 500,
          }}>
            Funcionalidades
          </span>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            margin: '12px 0 0',
            color: palette.white,
          }}>
            Todo lo que necesitas para operar
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
        }}>
          {features.map((feature) => (
            <div
              key={feature.title}
              style={{
                padding: '40px 32px',
                borderRadius: 12,
                background: palette.dark,
                border: `1px solid rgba(255,255,255,0.06)`,
                transition: 'all 300ms ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(5, 173, 152, 0.3)'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: 'rgba(5, 173, 152, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 22,
                fontWeight: 600,
                margin: '0 0 12px',
                color: palette.white,
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: 14,
                color: palette.mediumGray,
                lineHeight: 1.7,
                margin: 0,
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '120px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(5, 173, 152, 0.06) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          margin: '0 0 16px',
          color: palette.white,
          position: 'relative',
        }}>
          Comienza a administrar hoy
        </h2>
        <p style={{
          fontSize: 16,
          color: palette.mediumGray,
          margin: '0 0 40px',
          maxWidth: '400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.6,
          position: 'relative',
        }}>
          Accede al panel de control y lleva tu restaurante al siguiente nivel.
        </p>
        <button
          onClick={() => navigate({ to: '/login' })}
          style={{
            background: palette.teal,
            border: 'none',
            color: palette.white,
            padding: '16px 40px',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 200ms ease',
            fontFamily: 'inherit',
            boxShadow: `0 4px 24px rgba(5, 173, 152, 0.25)`,
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(5, 173, 152, 0.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(5, 173, 152, 0.25)'
          }}
        >
          Ir al Panel →
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 48px',
        borderTop: `1px solid rgba(255,255,255,0.06)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 5,
            background: palette.teal,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 700,
            fontSize: 11,
            color: palette.white,
          }}>
            RE
          </div>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 14,
            fontWeight: 500,
            color: palette.lightGray,
          }}>
            Restaurante Enterprise
          </span>
        </div>
        <span style={{ fontSize: 12, color: palette.mediumGray }}>
          Sistema de Gestion Operativa
        </span>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </div>
  )
}
