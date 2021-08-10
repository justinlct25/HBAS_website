import { authorizedUser } from '../utils/loginUsers';

export class LoginService {
  constructor() {}

  getUser = async (username: string) => {
    const user:
      | {
          username: string;
          password: string;
        }
      | undefined = authorizedUser[username];
    return user;
  };
}
