import mongoose from 'mongoose';
import logger from '@utils/logger';

export default (connection: string) => {
  const connect = () => {
    mongoose
      .connect(connection, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => {
        logger.info(`Successfully connected to ${connection}`);
      })
      .catch(err => {
        logger.error(`Error connecting to database`, err);
        return process.exit(1);
      });
  };
  connect();
  mongoose.connection.on('disconnected', connect);
};
