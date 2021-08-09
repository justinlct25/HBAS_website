import express from 'express';
import { loginController } from '../main';
import { isLoggedIn } from '../utils/guards';

export const loginRoutes = express.Router();

loginRoutes.post('/', loginController.login);
loginRoutes.get('/current-user', isLoggedIn, (req, res) => {
  res.json(req.user);
});
