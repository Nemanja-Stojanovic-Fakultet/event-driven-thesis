import { DynamicModule, Module } from "@nestjs/common";
import { KafkaModuleOptions } from "./kafka-options.interface";
import { KafkaService } from "./kafka.service";
import { KAFKA_OPTIONS } from "./kafka.tokens";

@Module({})
export class KafkaModule {
  static forRoot(options: KafkaModuleOptions): DynamicModule {
    return {
      module: KafkaModule,
      global: true,
      providers: [KafkaService, { provide: KAFKA_OPTIONS, useValue: options }],
      exports: [KAFKA_OPTIONS, KafkaService],
    };
  }
}
