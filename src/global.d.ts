export * from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    query?: { [key: string]: string };
  }
}
