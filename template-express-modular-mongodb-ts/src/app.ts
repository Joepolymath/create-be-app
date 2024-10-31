import 'module-alias/register';
import express, { Application, Request, Response } from 'express';
import 'colors';
import morgan from 'morgan';
import { Controller, errorHandler } from './common';

class App {
  app: Application;
  constructor(controllers: Controller[]) {
    this.app = express();
    this.initializeMiddlewares();
    this.initControllers(controllers);
    this.app.use(errorHandler);
  }

  private initControllers(controllers: Controller[]): void {
    controllers.forEach(async (controller: Controller) => {
      this.app.use('/api/v1', controller.router);
    });
  }
  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(morgan('dev'));
  }
}

export default App;
