import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Consumer, Kafka, Producer } from "kafkajs";
import { KafkaModuleOptions } from "./kafka-options.interface";
import { KAFKA_OPTIONS } from "./kafka.tokens";

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  private producer: Producer | null = null;

  constructor(
    @Inject(KAFKA_OPTIONS)
    private readonly options: KafkaModuleOptions,
  ) {
    this.kafka = new Kafka({
      connectionTimeout: 10000,
      clientId: options.clientId,
      brokers: options.brokers,
    });
  }

  onModuleInit() {
    console.log("Initializing kafka service", this.options);
  }

  private async connectProducer(): Promise<Producer> {
    try {
      if (!this.producer) {
        this.producer = this.kafka.producer({
          idempotent: true,
        });
        await this.producer.connect();
        console.log("Producer connected");
      }

      return this.producer;
    } catch (error) {
      console.error("Error connecting to producer", error);
      throw error;
    }
  }

  private async connectConsumer(
    topic: string,
    groupId: string,
  ): Promise<Consumer> {
    try {
      const consumer = this.kafka.consumer({ groupId, readUncommitted: false });
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: true });

      console.log(
        `Consumer connected to topic : ${topic} with groupId : ${groupId}`,
      );

      return consumer;
    } catch (error) {
      console.error(
        `Error connecting to consumer for topic: ${topic} with groupId: ${groupId}`,
        error,
      );
      throw error;
    }
  }

  async consumeMessages(
    topic: string,
    groupId: string,
    handleMessage: (message: any) => Promise<any>,
  ): Promise<void> {
    try {
      const consumer = await this.connectConsumer(topic, groupId);

      await consumer.run({
        eachMessage: async ({ message }) => {
          console.log(`Received message`);
          const payload = JSON.parse(message.value.toString());
          await handleMessage(payload);
        },
      });
    } catch (error) {
      console.error(`Error consuming the message ${error}`);
    }
  }

  async sendMessage(topic: string, message: any) {
    try {
      const producer = await this.connectProducer();

      await producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(message),
          },
        ],
      });

      console.log(`Message sent to topic ${topic}`);
    } catch (error) {
      console.error(`Error sending message to topic ${topic}`, error);
    }
  }
}
