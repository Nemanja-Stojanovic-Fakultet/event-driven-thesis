import { KafkaModule } from "@evt/kafka";
import { Module } from "@nestjs/common";
import { KafkaConsumerService } from "./kafka-consumer.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationEntity } from "./notification.entity";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url:
        process.env.DATABASE_URL ??
        "postgres://postgres:postgres@localhost:5432/notifications_db",
      autoLoadEntities: true,
      logging: ["error", "warn"],
    }),
    TypeOrmModule.forFeature([NotificationEntity]),
    KafkaModule.forRoot({
      clientId: "notification-service",
      brokers: [process.env.KAFKA_URL ?? "localhost:9092"],
    }),
  ],
  providers: [KafkaConsumerService],
})
export class AppModule {}
