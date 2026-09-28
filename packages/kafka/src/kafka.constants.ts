export const KAFKA_TOPICS = {
  ORDER_CREATED: "order.created",
  ORDER_PROCESSED: "order.processed",
} as const;

export type KafkaTopic = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];
