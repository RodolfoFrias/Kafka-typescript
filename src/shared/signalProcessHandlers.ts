import producer from '@kafka/producer';
import consumer from '@kafka/consumer';
import logger from './Logger';

const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

const successMessage = 'Producer and consumer have been shut down successfully, exiting process';

for (const errorType of errorTypes) {
  process.on(errorType, () => {
    Promise.all([
      producer.shutdown(),
      consumer.shutdown(),
    ]).then(() => {
      logger.info(successMessage);
      process.exit(0);
    }).catch(() => {
      process.exit(1);
    });
  });
}

for (const signalTrap of signalTraps) {
  process.on(signalTrap, () => {
    Promise.all([
      producer.shutdown(),
      consumer.shutdown(),
    ]).then(() => {
      logger.info(successMessage);
      process.exit(0);
    }).catch(() => {
      process.kill(process.pid, signalTrap);
    });
  });
}
