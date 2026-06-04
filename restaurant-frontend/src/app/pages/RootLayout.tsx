import { Outlet } from '@tanstack/react-router'
import { MainLayout } from '../../shared/layouts/MainLayout'

export function RootLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
