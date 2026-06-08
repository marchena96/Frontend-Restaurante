import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthSessionStore } from '../store/authSessionStore'

export function Login() {
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
      setError('Credenciales inválidas. Intente nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Iniciar sesión</h1>
        {error && <div className="error-message">{error}</div>}
        <div className="form-field">
          <label htmlFor="login-username">Usuario</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
