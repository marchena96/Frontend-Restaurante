/**
 * Tipos y interfaces compartidas globales
 */

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
