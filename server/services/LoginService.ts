import { authorizedUser } from '../utils/loginUsers';

export class LoginService {
  constructor() {}

  getUser = async (username: string) => {
    const user = authorizedUser[username];
    return user;
  };
}
