export const queryKeys = {
  clients: {
    all: ['clients'] as const,
    sidebar: ['clients', 'sidebar'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
  },
  infrastructure: {
    all: ['infrastructure'] as const,
    layout: ['infrastructure', 'layout'] as const,
    tables: {
      all: ['infrastructure', 'tables'] as const,
      available: (date: string, startTime: string, endTime: string) =>
        ['infrastructure', 'tables', 'available', date, startTime, endTime] as const,
    },
  },
  reservations: {
    all: ['reservations'] as const,
  },
  turns: {
    all: ['turns'] as const,
    sidebar: ['turns', 'sidebar'] as const,
  },
  waitingList: {
    all: ['waiting-list'] as const,
  },
} as const
