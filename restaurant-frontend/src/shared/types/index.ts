export type EntityId = number

export type IsoDate = string

export type TimeOnly = string

export interface ApiErrorResponse {
  message: string
  code?: string
  details?: readonly string[]
}

export interface PaginatedResponse<TItem> {
  items: readonly TItem[]
  page: number
  pageSize: number
  totalItems: number
}

export type RestaurantModule =
  | 'dashboard'
  | 'clients'
  | 'infrastructure'
  | 'reservations'
  | 'waiting-list'
