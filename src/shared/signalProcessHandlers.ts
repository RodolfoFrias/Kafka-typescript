
const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']
import producer from '@kafka/producer'
import consumer from '@kafka/consumer'

errorTypes.map(type => {
  process.on(type, async () => {
    try {
      await producer.disconnect()
      await consumer.disconnect()
      console.log(`process.on ${type}`)
      await 
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.map(type => {
  process.once(type, async () => {
    try {
      await producer.disconnect()
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})