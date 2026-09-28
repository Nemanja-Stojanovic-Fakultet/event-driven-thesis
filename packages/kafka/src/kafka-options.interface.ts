export interface KafkaConsumerOptions {
  // consumer group id
  groupId: string;
}

export interface KafkaModuleOptions {
  clientId: string;
  brokers: string[];
  consumer?: KafkaConsumerOptions;
}
