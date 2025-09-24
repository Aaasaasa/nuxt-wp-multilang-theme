export interface ApiResponse<T> {
  statusCode: number
  data?: T | null
  message?: string
}
// export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };
