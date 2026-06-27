import { useState, useRef, useEffect } from 'react'
import { useUpdateReservationStatusMutation } from '../hooks/useUpdateReservationStatusMutation'
import { canTransitionTo } from '../services/reservationRules'
import { notifyConfirm } from '@/shared/utils/toast'
import type { ReservationStatus } from '../types/reservation'

interface StatusDropdownProps {
  reservationId: number
  currentStatus: ReservationStatus
  clientName: string
}

const statusColors: Record<ReservationStatus, string> = {
  Pendiente: '#d97706',
  Confirmada: '#2563eb',
  Completada: '#16a34a',
  Cancelada: '#6b7280',
}

const statusLabels: Record<ReservationStatus, string> = {
  Pendiente: 'Pendiente',
  Confirmada: 'Confirmada',
  Completada: 'Completada',
  Cancelada: 'Cancelada',
}

export function StatusDropdown({
  reservationId,
  currentStatus,
  clientName,
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const mutation = useUpdateReservationStatusMutation()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  const transitions = (
    ['Confirmada', 'Cancelada', 'Completada'] as ReservationStatus[]
  ).filter((next) => canTransitionTo(currentStatus, next))

  const handleSelect = (nextStatus: ReservationStatus) => {
    const doMutate = () =>
      mutation.mutate(
        { id: reservationId, status: nextStatus },
        { onSettled: () => setIsOpen(false) },
      )

    if (nextStatus === 'Cancelada') {
      notifyConfirm(
        `Cancelar reserva de ${clientName}?`,
        doMutate,
        () => setIsOpen(false),
      )
      return
    }

    doMutate()
  }

  const isTerminal = transitions.length === 0
  const bg = statusColors[currentStatus]

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setIsOpen((o) => !o)}
        disabled={mutation.isPending}
        style={{ background: bg }}
        className={`
          inline-flex items-center gap-1.5 px-3 py-1 rounded-full
          text-white text-xs font-semibold leading-tight whitespace-nowrap
          transition-all duration-150 select-none
          ${isTerminal
            ? 'cursor-default opacity-80'
            : 'cursor-pointer hover:brightness-110 active:brightness-90'
          }
          ${mutation.isPending ? 'opacity-50 pointer-events-none' : ''}
        `}
        title={
          isTerminal
            ? 'Estado terminal'
            : `Cambiar a: ${transitions.join(', ')}`
        }
      >
        <span className="inline-flex items-center gap-1" style={{ color: '#fff' }}>
          {statusLabels[currentStatus]}
          {!isTerminal && (
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </span>
      </button>

      {isOpen && !isTerminal && (
        <div
          className={`
            absolute top-full left-0 mt-1.5 z-50
            min-w-[160px] overflow-hidden
            bg-white rounded-lg border shadow-lg
          `}
          style={{
            borderColor: '#d8ddd2',
            boxShadow: '0 8px 30px rgba(38,49,43,0.10)',
          }}
        >
          {transitions.map((status) => {
            const color = statusColors[status]
            return (
              <button
                key={status}
                onClick={() => handleSelect(status)}
                disabled={mutation.isPending}
                style={{ background: color }}
                className={`
                  w-full px-3 py-2.5 text-sm font-semibold text-white
                  text-left cursor-pointer border-0 leading-tight
                  transition-all duration-150 select-none
                  ${mutation.isPending ? 'opacity-50 pointer-events-none' : 'hover:brightness-110 active:brightness-90'}
                `}
              >
                {statusLabels[status]}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
