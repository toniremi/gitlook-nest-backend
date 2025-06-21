// src/github/interfaces/github-error.interface.ts

export interface GitHubApiErrorResponse {
  message?: string;
  documentation_url?: string;
  // For OAuth specific errors
  error?: string;
  error_description?: string;
  error_uri?: string;
  // Other common fields that might be in an error object
  errors?: { resource: string; field: string; code: string }[];
}
