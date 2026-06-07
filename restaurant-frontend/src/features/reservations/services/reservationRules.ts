import type { ReservationCreateInput, ReservationStatus } from '../types/reservation'

export function validateReservationInput(
  input: ReservationCreateInput,
): readonly string[] {
  const errors: string[] = []

  if (!input.clientId || input.clientId <= 0) {
    errors.push('Debe seleccionar un cliente')
  }

  if (!input.tableId || input.tableId <= 0) {
    errors.push('Debe seleccionar una mesa')
  }

  if (!input.date) {
    errors.push('La fecha es requerida')
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    errors.push('Formato de fecha invalido (YYYY-MM-DD)')
  }

  if (!input.reservationTime) {
    errors.push('La hora es requerida')
  } else if (!/^\d{2}:\d{2}/.test(input.reservationTime)) {
    errors.push('Formato de hora invalido (HH:mm)')
  }

  if (!input.guestCount || input.guestCount < 1) {
    errors.push('Debe haber al menos 1 invitado')
  }

  return errors
}

export function canTransitionTo(
  current: ReservationStatus,
  next: ReservationStatus,
): boolean {
  const transitions: Record<ReservationStatus, readonly ReservationStatus[]> = {
    Pendiente: ['Confirmada', 'Cancelada'],
    Confirmada: ['Completada', 'Cancelada'],
    Completada: [],
    Cancelada: [],
  }
  return transitions[current]?.includes(next) ?? false
}

export function getTodayDateString(): string {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getDefaultTimeSlot(): string {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const roundedMinutes = Math.ceil(minutes / 30) * 30
  const adjustedHours = roundedMinutes === 60 ? hours + 1 : hours
  const adjustedMinutes = roundedMinutes === 60 ? 0 : roundedMinutes
  return `${String(adjustedHours).padStart(2, '0')}:${String(adjustedMinutes).padStart(2, '0')}`
}
