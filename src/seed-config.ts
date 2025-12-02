// src/seed-config.ts
import { config as dotenvConfig } from 'dotenv';
import { DataSource } from 'typeorm';

dotenvConfig({ path: '.env' });

// This config is specifically for typeorm-extension with seeds support
const seedConfig = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/db/entities/*.entity.{js,ts}'],
  migrations: ['dist/db/migrations/*.{js,ts}'],
  seeds: ['dist/db/seeds/*.{js,ts}'],
  synchronize: false,
};

export const SeedDataSource = new DataSource(seedConfig as any);
export default seedConfig;
