
const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']
import producer from '@kafka/producer'
import consumer from '@kafka/consumer'
import logger from './Logger'

for (const errorType of errorTypes) {
  process.on(errorType, () => {
      Promise.all([
        producer.shutdown(),
        consumer.shutdown()
      ]).then(() => { 
        logger.info('All promises resolved, exiting process');
        process.exit(0)
      })
      .catch(() => {
        process.exit(1)
      })
  })
}

for (const signalTrap of signalTraps) {
  process.on(signalTrap, () => {
      Promise.all([
        producer.shutdown(),
        consumer.shutdown()
      ]).then(() => { 
        logger.info('All promises resolved, exiting process');
        process.exit(0)
      })
      .catch(() => {
        process.kill(process.pid, signalTrap)
      })
  })
}
