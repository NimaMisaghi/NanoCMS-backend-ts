// src/shared/db.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Pool } from 'pg';

class DB {
  private static dynamoClient: DynamoDBDocumentClient;
  private static pgPool: Pool;

  // --- DynamoDB ---
  static getDynamoClient() {
    if (!DB.dynamoClient) {
      const rawClient = new DynamoDBClient({});
      DB.dynamoClient = DynamoDBDocumentClient.from(rawClient, {
        marshallOptions: { removeUndefinedValues: true },
      });
    }
    return DB.dynamoClient;
  }

  // --- Aurora (Postgres) ---
  static getPostgresPool() {
    if (!DB.pgPool) {
      DB.pgPool = new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        max: 10, // connection pool size
      });
    }
    return DB.pgPool;
  }
}

export default DB;
