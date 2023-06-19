import express from 'express';
import { setMiddlewares } from './middlewares';
import { setRoutes } from '../routes';

export const app = express();

setMiddlewares(app);
setRoutes(app);