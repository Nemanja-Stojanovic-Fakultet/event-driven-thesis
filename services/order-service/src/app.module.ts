import { Module } from "@nestjs/common";
import { OrdersModule } from "./orders/orders.module";
import { KafkaModule } from "@evt/kafka";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url:
        process.env.DATABASE_URL ??
        "postgres://postgres:postgres@localhost:5432/orders_db",
      autoLoadEntities: true,
      logging: ["error", "warn"],
    }),
    OrdersModule,
    KafkaModule.forRoot({
      clientId: "order-service",
      brokers: [process.env.KAFKA_URL ?? "localhost:9092"],
    }),
  ],
})
export class AppModule {}
