import { createError } from "h3"
import type { ApiResponse } from "@@shared/types/api"

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const

/**
 * Standardizovan API response
 */
export function createApiResponse<T>(
  data?: T | null,
  statusCode: number = HTTP_STATUS.OK,
  message: string = "OK"
): ApiResponse<T> {
  return {
    statusCode,
    data,
    message
  }
}

/**
 * Create a response for created resources
 */
export function createCreatedResponse<T>(data: T): ApiResponse<T> {
  return createApiResponse(data, HTTP_STATUS.CREATED, "Resource created successfully")
}

/**
 * Create a response for no content
 */
export function createNoContentResponse(): ApiResponse<null> {
  return createApiResponse(null, HTTP_STATUS.NO_CONTENT, "No Content")
}

/**
 * Create a response for deleted resources
 */
export function createDeletedResponse(): ApiResponse<null> {
  return createApiResponse(null, HTTP_STATUS.NO_CONTENT, "Resource deleted successfully")
}

/**
 * Not found error
 */
export function notFoundError(message = "Resource not found") {
  throw createError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    statusMessage: message
  })
}

/**
 * Bad request error
 */
export function badRequestError(message = "Bad Request") {
  throw createError({
    statusCode: HTTP_STATUS.BAD_REQUEST,
    statusMessage: message
  })
}

/**
 * Server error
 */
export function serverError(message = "Internal Server Error") {
  throw createError({
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    statusMessage: message
  })
}

/**
 * Validation error (422)
 */
export function validationError(message = "Validation Error") {
  throw createError({
    statusCode: 422,
    statusMessage: message
  })
}
