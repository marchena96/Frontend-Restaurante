import { describe, it, expect, vi } from 'vitest'
import {
  validateReservationInput,
  canTransitionTo,
  getTodayDateString,
  getDefaultTimeSlot,
} from '../reservationRules'
import type { ReservationCreateInput } from '@/features/reservations/forms/reservationSchema'

describe('validateReservationInput', () => {
  const validInput: ReservationCreateInput = {
    clientId: 1,
    tableId: 2,
    date: '2026-06-20',
    reservationTime: '14:30',
    guestCount: 4,
  }

  it('returns empty errors for valid input', () => {
    const errors = validateReservationInput(validInput)
    expect(errors).toHaveLength(0)
  })

  it('requires clientId', () => {
    const errors = validateReservationInput({ ...validInput, clientId: 0 })
    expect(errors).toContain('Debe seleccionar un cliente')
  })

  it('requires tableId', () => {
    const errors = validateReservationInput({ ...validInput, tableId: 0 })
    expect(errors).toContain('Debe seleccionar una mesa')
  })

  it('requires date', () => {
    const errors = validateReservationInput({ ...validInput, date: '' })
    expect(errors).toContain('La fecha es requerida')
  })

  it('validates date format', () => {
    const errors = validateReservationInput({ ...validInput, date: '20-06-2026' })
    expect(errors).toContain('Formato de fecha invalido (YYYY-MM-DD)')
  })

  it('requires reservationTime', () => {
    const errors = validateReservationInput({ ...validInput, reservationTime: '' })
    expect(errors).toContain('La hora es requerida')
  })

  it('validates time format', () => {
    const errors = validateReservationInput({ ...validInput, reservationTime: 'abc' })
    expect(errors).toContain('Formato de hora invalido (HH:mm)')
  })

  it('requires at least 1 guest', () => {
    const errors = validateReservationInput({ ...validInput, guestCount: 0 })
    expect(errors).toContain('Debe haber al menos 1 invitado')
  })

  it('collects multiple errors', () => {
    const errors = validateReservationInput({
      clientId: 0,
      tableId: 0,
      date: '',
      reservationTime: '',
      guestCount: 0,
    })
    expect(errors.length).toBeGreaterThanOrEqual(4)
  })
})

describe('canTransitionTo', () => {
  it('allows Pendiente -> Confirmada', () => {
    expect(canTransitionTo('Pendiente', 'Confirmada')).toBe(true)
  })

  it('allows Pendiente -> Cancelada', () => {
    expect(canTransitionTo('Pendiente', 'Cancelada')).toBe(true)
  })

  it('allows Confirmada -> Completada', () => {
    expect(canTransitionTo('Confirmada', 'Completada')).toBe(true)
  })

  it('allows Confirmada -> Cancelada', () => {
    expect(canTransitionTo('Confirmada', 'Cancelada')).toBe(true)
  })

  it('disallows Completada -> any', () => {
    expect(canTransitionTo('Completada', 'Cancelada')).toBe(false)
    expect(canTransitionTo('Completada', 'Pendiente')).toBe(false)
  })

  it('disallows Cancelada -> any', () => {
    expect(canTransitionTo('Cancelada', 'Pendiente')).toBe(false)
    expect(canTransitionTo('Cancelada', 'Confirmada')).toBe(false)
  })

  it('disallows Pendiente -> Completada (skip)', () => {
    expect(canTransitionTo('Pendiente', 'Completada')).toBe(false)
  })
})

describe('getTodayDateString', () => {
  it('returns date in YYYY-MM-DD format', () => {
    const result = getTodayDateString()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('matches current date', () => {
    const now = new Date()
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    expect(getTodayDateString()).toBe(expected)
  })
})

describe('getDefaultTimeSlot', () => {
  it('returns time in HH:mm format', () => {
    const result = getDefaultTimeSlot()
    expect(result).toMatch(/^\d{2}:\d{2}$/)
  })

  it('rounds minutes to next 30', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 18, 14, 10, 0, 0))

    const result = getDefaultTimeSlot()

    vi.useRealTimers()
    expect(result).toBe('14:30')
  })
})
