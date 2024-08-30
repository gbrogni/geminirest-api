import { Either } from '../either';

export class ApiResponse<T> {
  public status: string;
  public code: number;
  public message: string;
  public data: T | null;

  constructor(status: string, code: number, message: string, data: T | null = null) {
    this.status = status;
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message: string = 'Operation successful'): ApiResponse<T> {
    return new ApiResponse<T>('success', 200, message, data);
  }

  static error<T>(code: number, message: string, data: T | null = null): ApiResponse<T> {
    return new ApiResponse<T>('error', code, message, data);
  }

  static fromEither<L, R>(either: Either<L, R>, successCode: number = 200, errorCode: number = 400): ApiResponse<R> {
    if (either.isRight()) {
      return new ApiResponse<R>('success', successCode, 'Operation successful', either.value);
    } else {
      return new ApiResponse<R>('error', errorCode, either.value as unknown as string, null);
    }
  }
}