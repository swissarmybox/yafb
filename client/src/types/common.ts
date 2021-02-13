export interface APISuccess<T> {
  status: 'success';
  data: T;
}

export interface APIFailure {
  status: 'failure';
  error: {
    code: number;
    name: string;
    message: string;
    stack: string;
  };
}

export type APIResult<T> = APISuccess<T> | APIFailure;
