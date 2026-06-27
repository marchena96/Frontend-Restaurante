import type { EntityId } from '@/shared/types'

export interface TurnDto {
  id: EntityId
  name: string
  startTime: string
  endTime: string
}

export interface TurnFormInput {
  name: string
  startTime: string
  endTime: string
}
