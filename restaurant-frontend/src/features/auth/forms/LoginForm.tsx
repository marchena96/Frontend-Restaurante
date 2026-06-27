import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthSessionStore } from '../store/authSessionStore'

export function LoginForm() {
  const navigate = useNavigate()
  const login = useAuthSessionStore((s) => s.login)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login({ username, password })
      navigate({ to: '/admin' })
    } catch {
      setError('Credenciales invalidas. Intente nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-strong))',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '20px',
              color: 'var(--bg)',
              marginBottom: '20px',
              letterSpacing: '0.05em',
            }}
          >
            RE
          </div>
        </div>
        <h1>Bienvenido</h1>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '14px',
            marginBottom: '32px',
          }}
        >
          Ingrese sus credenciales para acceder
        </p>
        {error && <div className="error-message">{error}</div>}
        <div className="form-field">
          <label htmlFor="login-username">Usuario</label>
          <input
            id="login-username"
            type="text"
            placeholder="Ingrese su usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="login-password">Contrasena</label>
          <input
            id="login-password"
            type="password"
            placeholder="Ingrese su contrasena"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Ingresando...' : 'Iniciar sesion'}
        </button>
      </form>
    </div>
  )
}
