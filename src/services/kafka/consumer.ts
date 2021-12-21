import { 
    Consumer, 
    ConsumerSubscribeTopic, 
    EachBatchPayload, 
    Kafka
} from 'kafkajs'
import logger from '@shared/Logger'

class ConsumerFactory {
    private kafkaConsumer: Consumer
  
    public constructor() {
      this.kafkaConsumer = this.createKafkaConsumer()
    }
  
  
    public async startBatchConsumer(): Promise<void> {
      const topic: ConsumerSubscribeTopic = {
        topic: 'example-topic',
        fromBeginning: false
      }
  
      try {
        await this.kafkaConsumer.connect()
        await this.kafkaConsumer.subscribe(topic)
        await this.kafkaConsumer.run({
          eachBatch: async (eachBatchPayload: EachBatchPayload) => {
            const { topic, partition, batch } = eachBatchPayload
            for (const message of batch.messages) {
              const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
              logger.info(`- ${prefix} ${message.key}#${message.value}`) 
              this.processBatch(eachBatchPayload)
            }
          }
        })
      } catch (error) {
        logger.err('Error: ' + error)
      }
    }
  
    public async shutdown(): Promise<void> {
      await this.kafkaConsumer.disconnect()
    }
  
    private createKafkaConsumer(): Consumer {
      const kafka = new Kafka({ 
        clientId: 'client-id',
        brokers: ['example.kafka.broker:9092']
      })
      return kafka.consumer({ groupId: 'consumer-group' })
    }

    public processBatch(batch: EachBatchPayload): void {
        logger.info(`Sending batch: ${batch}`)
    }

}

export default ConsumerFactory