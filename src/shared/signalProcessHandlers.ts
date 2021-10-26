
const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']
import producer from '@kafka/producer'

errorTypes.map(type => {
  process.on(type, async () => {
    try {
      await producer.disconnect()
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
    } finally {
      process.kill(process.pid, type)
    }
  })
})