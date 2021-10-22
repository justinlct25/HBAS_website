export interface ILoginData {
  id: number;
  username: string;
  role: string;
  devices: number[] | null;
}

declare module 'express-serve-static-core' {
  interface Request {
    user: ILoginData;
  }
}
