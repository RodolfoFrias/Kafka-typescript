import { Kafka, EachMessagePayload  } from 'kafkajs'
import logger from '@shared/Logger'

class Consumer {
    private kafka: Kafka
    private consumer: any
    constructor() {
        this.kafka = new Kafka({
            clientId: 'kafka-consumer',
            brokers: ['localhost:29092']
        })
        this.consumer = this.kafka.consumer({ groupId: 'kafka-consumer' })
    }

    async disconnect() { 
        await this.consumer.disconnect()
    }

    async init() {
        logger.info('[Kafka] Consumer init')
        await this.consumer.connect()
        await this.consumer.subscribe({ topic: 'test' })
        await this.consumer.run({
            eachMessage: async (messagePayload: EachMessagePayload) => {
                const { topic, partition, message } = messagePayload
                const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
                logger.info(`- ${prefix} ${message.key}#${message.value}`)
              }
        })
    }
}

export default new Consumer()