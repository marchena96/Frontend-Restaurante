import type { EntityId } from '../../../shared/types'

export type TableStatus = 'Libre' | 'Ocupada' | 'Reservada' | 'Bloqueada'

export interface RestaurantTable {
  id: EntityId
  tableNumber: string
  capacity: number
  status: TableStatus
  zoneName: string
}
