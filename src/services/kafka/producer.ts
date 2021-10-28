
import { Kafka } from 'kafkajs'
import logger from '@shared/Logger'
import { IUser } from '@entities/User';

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

    public async disconnect(): Promise<void> {
        await this.producer.disconnect()
    }

    public async run(): Promise<void> {
        logger.info(`Running kafka producer with topic ${this.topic}`)
        await this.producer.connect()
    }

    public async send(message: IUser): Promise<any> {
       return this.producer.send({
            topic: this.topic,
            messages: [{ value: JSON.stringify(message), key: message.id }]
        })
    }
}

export default new Producer()
