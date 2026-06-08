import type { Client } from '../types/client'

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
  clients: readonly Client[],
  query: string,
): readonly Client[] {
  const q = query.toLowerCase()
  return clients.filter(
    (c) =>
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.phoneNumber.includes(q) ||
      c.idCard.toLowerCase().includes(q),
  )
}
