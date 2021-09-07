import express from 'express';
import { usersController } from '../main';
import { createAsyncMiddleware } from '../utils/middleware';

export const usersRoutes = express.Router();

usersRoutes.get('/', createAsyncMiddleware(usersController.getUsers));
usersRoutes.post('/', createAsyncMiddleware(usersController.addUsers));
