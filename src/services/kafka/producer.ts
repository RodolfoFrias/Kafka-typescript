
import { Kafka } from 'kafkajs'
import logger from '@shared/Logger';

class Producer {
    topic: string
    private producer: any
    private kafka: any

    constructor(){
        this.topic = 'test'
        this.kafka = new Kafka({
            brokers: [`localhost:29092`],
            clientId: 'example-producer',
        })
        this.producer = this.kafka.producer()
    }

    public async disconnect(): Promise<any> {
        await this.producer.disconnect()
    }

    public async run(): Promise<void> {
        logger.info(`Running kafka producer with topic ${this.topic}`)
        await this.producer.connect()
    }

    public async send(message: JSON): Promise<any> {
        return this.producer.send({
            topic: this.topic,
            messages: message
        })
    }
}

export default new Producer()
