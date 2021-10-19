export interface ILoginState {
  isLoggedIn: boolean | null;
  username: string | null;
  token: string;
  error: string | null;
  role: string;
  devices: number[] | null;
}
