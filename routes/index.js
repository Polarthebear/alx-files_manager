// eslint-disable-next-line no-unused-vars
import { Express } from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';
import FilesController from '../controllers/FilesController';
import { basicAuthenticate, xTokenAuthenticate } from '../middlewares/auth';
import { APIError, errorResponse } from '../middlewares/error';

/**
 * Defines all application routes and their handlers.
 * @param {Express} api - Express application instance.
 */
const injectRoutes = (api) => {
  // App Routes
  const appRoutes = [
    { method: 'get', path: '/status', handler: AppController.getStatus },
    { method: 'get', path: '/stats', handler: AppController.getStats },
  ];

  // Auth Routes
  const authRoutes = [
    { method: 'get', path: '/connect', handler: AuthController.getConnect, middleware: basicAuthenticate },
    { method: 'get', path: '/disconnect', handler: AuthController.getDisconnect, middleware: xTokenAuthenticate },
  ];

  // User Routes
  const userRoutes = [
    { method: 'post', path: '/users', handler: UsersController.postNew },
    { method: 'get', path: '/users/me', handler: UsersController.getMe, middleware: xTokenAuthenticate },
  ];

  // File Routes
  const fileRoutes = [
    { method: 'post', path: '/files', handler: FilesController.postUpload, middleware: xTokenAuthenticate },
    { method: 'get', path: '/files/:id', handler: FilesController.getShow, middleware: xTokenAuthenticate },
    { method: 'get', path: '/files', handler: FilesController.getIndex, middleware: xTokenAuthenticate },
    { method: 'put', path: '/files/:id/publish', handler: FilesController.putPublish, middleware: xTokenAuthenticate },
    { method: 'put', path: '/files/:id/unpublish', handler: FilesController.putUnpublish, middleware: xTokenAuthenticate },
    { method: 'get', path: '/files/:id/data', handler: FilesController.getFile },
  ];

  // Register Routes
  const registerRoutes = (routes) => {
    routes.forEach(({ method, path, handler, middleware }) => {
      if (middleware) {
        api[method](path, middleware, handler);
      } else {
        api[method](path, handler);
      }
    });
  };

  registerRoutes(appRoutes);
  registerRoutes(authRoutes);
  registerRoutes(userRoutes);
  registerRoutes(fileRoutes);

  // 404 Error Handling
  api.all('*', (req, res, next) => {
    errorResponse(new APIError(404, `Cannot ${req.method} ${req.url}`), req, res, next);
  });

  // General Error Middleware
  api.use(errorResponse);
};

export default injectRoutes;

