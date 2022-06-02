
import { Kafka, logCreator, logLevel, Producer, ProducerBatch } from 'kafkajs'
import logger from '@shared/Logger'
import { IUser } from '@entities/User';

class ProducerFactory {
    private producer: Producer

    constructor() {
      this.producer = this.createProducer()
    }
  
    public async start(): Promise<void> {
      try {
        await this.producer.connect()
      } catch (error) {
        const newError = new Error(`Error connecting to the producer ${error}`)
        logger.err(newError)
      }
    }
  
    public async shutdown(): Promise<void> {
      await this.producer.disconnect()
    }
  
    public async sendBatch(messages: Array<IUser>): Promise<void> {
      const kafkaMessages = messages.map((message) => { value: JSON.stringify(message) })
  
      const topicMessages = {
        topic: 'producer-topic',
        messages: kafkaMessages
      }
  
      const batch: ProducerBatch = {
        topicMessages: [topicMessages]
      }

      await this.producer.sendBatch(batch)
    }
  
    private createProducer() : Producer {
      const kafka = new Kafka({
        clientId: 'producer-client',
        brokers: ['localhost:9092'],
      })
  
      return kafka.producer()
    }
}

export default new ProducerFactory()
