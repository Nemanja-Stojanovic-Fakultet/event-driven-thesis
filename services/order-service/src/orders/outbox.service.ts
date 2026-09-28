import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OutboxEntity } from "./entities/outbox.entity";
import { Repository } from "typeorm";
import { KafkaService } from "@evt/kafka";
import { Interval } from "@nestjs/schedule";

@Injectable()
export class OutboxService {
  @InjectRepository(OutboxEntity)
  private readonly outboxRepo: Repository<OutboxEntity>;

  constructor(private kafkaService: KafkaService) {}

  @Interval(2000) // every 2 seconds
  async cron() {
    console.log("Running background job for processing the outbox messages");
    const pendingMessages = await this.outboxRepo.find({
      where: { status: "PENDING" },
    });

    for (const message of pendingMessages) {
      console.log("Sending order message", message);
      await this.kafkaService.sendMessage(
        message.topic,
        JSON.parse(message.payload),
      );
      message.status = "SENT";
      await this.outboxRepo.save(message);
    }
  }
}
