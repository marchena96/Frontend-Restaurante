export interface MetricsDto {
  activeReservations: number
  pendingReservations: number
  availableTables: number
  largeTablesAvailable: number
  waitingListCount: number
  averageWaitMinutes: number
  occupancyPercent: number
}

export interface ZoneSummaryDto {
  id: number
  name: string
  tableCount: number
  occupancyPercent: number
}

export interface UpcomingBlockDto {
  time: string
  clientName: string
  tableNumber: string
  status: string
}

export interface DashboardResponse {
  metrics: MetricsDto
  zones: ZoneSummaryDto[]
  upcomingBlocks: UpcomingBlockDto[]
}
