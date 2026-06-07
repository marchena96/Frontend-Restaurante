import type { ClientResponse } from '../types/client'

export function formatClientPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
  }
  return phone
}

export function getClientInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function filterClientsByQuery(
  clients: readonly ClientResponse[],
  query: string,
): readonly ClientResponse[] {
  const q = query.toLowerCase()
  return clients.filter(
    (c) =>
      c.fullName.toLowerCase().includes(q) ||
      c.phoneNumber.includes(q) ||
      (c.email ?? '').toLowerCase().includes(q),
  )
}
