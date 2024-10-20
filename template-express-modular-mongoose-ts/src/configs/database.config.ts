// database connection
import mongoose from 'mongoose';
import logger from './logger.config';

const connectDb = async (uri: string) => {
  try {
    const conn = await mongoose.connect(uri);
    logger.info(
      `Database connected success. Connected to ${conn.connection.host}`.yellow
        .bold
    );
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

export default connectDb;
