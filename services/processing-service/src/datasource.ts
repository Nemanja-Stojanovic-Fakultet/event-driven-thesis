import "reflect-metadata";
import { DataSource } from "typeorm";

export default new DataSource({
  type: "postgres",
  url:
    process.env.DATABASE_URL ??
    "postgres://postgres:postgres@localhost:5432/processing_db",
  logging: ["error", "schema"],
  synchronize: false,
  entities: [`./**/*.entity.ts`],
  migrations: ["./migrations/*.ts"],
  subscribers: [],
});
