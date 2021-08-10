export interface ILoginData {
  username: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user: ILoginData;
  }
}
