import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AxiosError } from 'axios'; // Import AxiosError
import {
  ExternalApiErrorResponse,
  NestHttpExceptionResponse,
} from '../interfaces/error-responses.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error'; // Default message

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse(); // Type: string | object

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        // Assert to our NestHttpExceptionResponse interface
        const nestError = exceptionResponse as NestHttpExceptionResponse;
        if (nestError.message) {
          message = nestError.message;
        } else if (nestError.error) {
          // Fallback to 'error' property if 'message' is missing (e.g., 'Bad Request')
          message = nestError.error;
        }
      }
    } else if (exception instanceof AxiosError) {
      // Axios errors (e.g., from external API calls)
      // Safely get status, defaulting to BAD_GATEWAY (502) if no response status
      status = exception.response?.status || HttpStatus.BAD_GATEWAY;

      // Assert exception.response?.data to our ExternalApiErrorResponse interface
      const errorData = exception.response?.data as ExternalApiErrorResponse;

      // Prioritize specific error messages from the external API data,
      // then fall back to Axios's general message, then a generic string.
      message =
        errorData?.message ||
        errorData?.error_description ||
        errorData?.error ||
        exception.message ||
        'External API error';

      // Log more details about the Axios error for debugging
      console.error('Axios Error Caught:', {
        status: exception.response?.status,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: exception.response?.data, // This will still be 'any' or 'unknown' here for logging, but access is now safe.
        message: exception.message,
        config: exception.config,
      });
    } else if (exception instanceof Error) {
      // Generic JavaScript Errors (e.g., TypeError, ReferenceError)
      message = exception.message;
      console.error('Generic Error Caught:', exception);
    } else {
      // Fallback for any other unknown error type
      message = String(exception); // Convert unknown error to string
      console.error('Unknown Error Caught:', exception);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
