import express from 'express';
import { loginController } from '../main';

export const loginRoutes = express.Router();

loginRoutes.post('/', loginController.login);
