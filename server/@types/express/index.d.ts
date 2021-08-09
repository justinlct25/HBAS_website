export interface ILoginData {
  id: number;
  email: string;
  role: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user: ILoginData;
  }
}
