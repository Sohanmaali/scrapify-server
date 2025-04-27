// custom-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';


export class CustomException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    public readonly errorCode?: string,
    public readonly details?: any
  ) {
    // CustomException(status, HttpStatus.BAD_REQUEST, errorCode, message);
    super(
      {
        message,
        statusCode,
        errorCode,
        details,
        timestamp: new Date().toISOString(),
      },
      statusCode
    );
  }
}

@Catch(CustomException, HttpException, Error)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException | HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let status = 'error';
    let errorCode = 'INTERNAL_ERROR';
    let message = null;

    if (exception instanceof CustomException) {
      const error = exception.getResponse() as any;
      statusCode = exception.getStatus();
      status = error.message;
      errorCode = error.errorCode;
      message = error.details;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const error = exception.getResponse() as any;
      status = error.message || error.error || exception.message;
    } else {
      // Handle unknown errors
      console.error('Unhandled error:', exception);
    }
    const data = {
      statusCode,
      status,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
    }

    response.status(statusCode).json(data);
  }
}

// exception.helper.ts

export class ResponseHelper {

  static badRequest(status: string, errorCode?: string, message?: any) {
    throw new CustomException(status, HttpStatus.BAD_REQUEST, errorCode, message);
  }

  static unauthorized(status: string, errorCode?: string, message?: any) {
    throw new CustomException(status, HttpStatus.UNAUTHORIZED, errorCode, message);
  }

  static forbidden(status: string, errorCode?: string, message?: any) {
    throw new CustomException(status, HttpStatus.FORBIDDEN, errorCode, message);
  }

  static notFound(status: string, errorCode?: string, message?: any) {

    console.log("status", status);
    console.log("message", message);
    
    throw new CustomException(status, HttpStatus.NOT_FOUND, errorCode, message);
  }


  static conflict(status: string, errorCode?: string, message?: any) {
    throw new CustomException(status, HttpStatus.CONFLICT, errorCode, message);
  }

  static internalError(status: string, errorCode?: string, message?: any) {
    throw new CustomException(
      status,
      HttpStatus.INTERNAL_SERVER_ERROR,
      errorCode,
      message
    );
  }
  // ====================SUCCESS=================================
  // Success handling methods
  static success(status: string, statusCode: number = 200, message = "success", data?: any,) {
    // success("success", data, 201);
    return {
      success: true,
      status,
      data,
      statusCode,
      message
    };
  }
}