// src/common/interfaces/error-responses.interface.ts

/**
 * Interface for typical NestJS HttpException response bodies.
 * NestJS often returns { statusCode: number, message: string | string[], error?: string }
 */
export interface NestHttpExceptionResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  // Depending on your validation pipes, 'message' might be an array of strings,
  // or you might have other fields like 'errors'. Adjust as needed.
}

/**
 * Interface for typical external API error responses (like GitHub's).
 * This covers cases where the external API returns { message: string }
 * or for OAuth errors { error: string, error_description: string }.
 */
export interface ExternalApiErrorResponse {
  message?: string;
  error?: string; // Common for OAuth errors
  error_description?: string; // Common for OAuth errors
  documentation_url?: string;
  // Add any other properties you expect from external API error payloads
}
