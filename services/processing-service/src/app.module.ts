import { KafkaModule } from "@evt/kafka";
import { Module } from "@nestjs/common";
import { KafkaConsumerService } from "./kafka-consumer.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProcessedOrdersEntity } from "./entities/processed-orders.entity";
import { ConfigModule } from "@nestjs/config";
import { MessagesEntity } from "./entities/messages.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url:
        process.env.DATABASE_URL ??
        "postgres://postgres:postgres@localhost:5432/processing_db",
      autoLoadEntities: true,
      logging: ["error", "warn"],
    }),
    TypeOrmModule.forFeature([ProcessedOrdersEntity, MessagesEntity]),
    KafkaModule.forRoot({
      clientId: "processing-service",
      brokers: [process.env.KAFKA_URL ?? "localhost:9092"],
    }),
  ],
  providers: [KafkaConsumerService],
})
export class AppModule {}
