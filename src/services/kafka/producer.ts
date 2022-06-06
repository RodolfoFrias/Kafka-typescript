import {
  Kafka, Producer, ProducerBatch, TopicMessages,
} from 'kafkajs';

interface CustomMessageFormat { a: string }

class ProducerFactory {
  static shutdown(): any {
    throw new Error('Method not implemented.');
  }

  private producer: Producer;

  private kafka: Kafka;

  private logger: any;

  private topicName: string;

  constructor(kafkaClient: Kafka, logger: any, topicName: string) {
    this.producer = this.createProducer();
    this.kafka = kafkaClient;
    this.logger = logger;
    this.topicName = topicName;
  }

  public async start(): Promise<void> {
    try {
      await this.producer.connect();
    } catch (error) {
      const newError = new Error(`Error connecting to the producer ${JSON.stringify(error)}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.logger.err(newError);
    }
  }

  public async shutdown(): Promise<void> {
    await this.producer.disconnect();
  }

  public async sendBatch(messages: Array<CustomMessageFormat>): Promise<void> {
    const kafkaMessages: Array<any> = messages.map((message) => ({
      value: JSON.stringify(message),
    }));
    const topicMessages: TopicMessages = {
      topic: this.topicName,
      messages: kafkaMessages,
    };

    const batch: ProducerBatch = {
      topicMessages: [topicMessages],
    };

    await this.producer.sendBatch(batch);
  }

  private createProducer() : Producer {
    return this.kafka.producer();
  }
}

export default ProducerFactory;
