export class AppError extends Error {
    statusCode: number;
    details?: any;
  
    constructor(message: string, statusCode: number, details?: any) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
      Object.setPrototypeOf(this, new.target.prototype);
      Error.captureStackTrace(this);
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Bad Request", details?: any) {
        super(message, 400, details);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized", details?: any) {
        super(message, 401, details);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Not Found", details?: any) {
        super(message, 404, details);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict", details?: any) {
        super(message, 409, details);
    }
}  