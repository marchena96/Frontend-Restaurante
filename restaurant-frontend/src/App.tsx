import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { useEffect } from 'react'
import { queryClient } from './app/queryClient'
import { router } from './app/router'
import { useAuthSessionStore } from './features/auth/store/authSessionStore'
import './App.css'

function App() {
  const initialize = useAuthSessionStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
