import mongoose from 'mongoose';
import Bluebird from 'bluebird';

import { DB_URI } from '../configs/env.config';
import { logger } from '@app/configs';

export const connectDb = function () {
  let db;

  mongoose.Promise = Bluebird;

  const options = {
    useNewUrlParser: true,
    socketTimeoutMS: 0,
  };

  mongoose.connect(DB_URI, options);
  db = mongoose.connection;
  db.on('error', (err) => {
    logger.error('Error connecting to database.'.red, err);
  });
  db.once('connected', () => {
    logger.info('Database Connection is Successful'.blue.bold);
  });
  db.once('disconnected', () => {
    logger.info('Database Disconnected');
  });
};
