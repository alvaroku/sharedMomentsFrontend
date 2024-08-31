export interface ResultPattern<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  statusCode: number;
}
