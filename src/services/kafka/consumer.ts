import {
  Consumer,
  ConsumerSubscribeTopic,
  EachMessagePayload,
  Kafka,
} from 'kafkajs';

interface Configuration {
  groupId: string;
  topicName: string;
}

class ConsumerFactory {
  static shutdown(): any {
    throw new Error('Method not implemented.');
  }

  private kafkaConsumer: Consumer;

  private logger;

  private callback: (message: EachMessagePayload) => Promise<void>;

  private kafka: Kafka;

  private configuration: Configuration;

  private groupId: string;

  private topicName: string;

  public constructor(
    kafkaClient: Kafka,
    loggerClass: any,
    functionTorun: () => Promise<void>,
    configuration: Configuration,
  ) {
    this.kafka = kafkaClient;
    this.kafkaConsumer = this.createKafkaConsumer();
    this.logger = loggerClass;
    this.callback = functionTorun;
    this.configuration = configuration;
    this.groupId = this.configuration.groupId;
    this.topicName = this.configuration.topicName;
  }

  public async startBatchConsumer(): Promise<void> {
    const topic: ConsumerSubscribeTopic = {
      topic: 'example-topic',
      fromBeginning: false,
    };

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);
      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          await this.callback(messagePayload);
        },
      });
    } catch (error) {
      const newError = new Error(
        `There was an error processing the batch: ${JSON.stringify(error)}`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.logger.err(newError);
    }
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect();
  }

  private createKafkaConsumer(): Consumer {
    return this.kafka.consumer({ groupId: 'consumer-group' });
  }
}

export default ConsumerFactory;
