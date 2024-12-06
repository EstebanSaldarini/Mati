import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Determinar el archivo de entorno según NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env' : 'dev.env';

// Cargar el archivo de entorno correspondiente
dotenv.config({ path: envFile });

console.log(`Using environment file: ${envFile}`);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migration/*{.ts,.js}'],
  synchronize: false,
});

