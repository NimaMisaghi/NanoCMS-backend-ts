// src/shared/dynamo.ts
import { DynamoDB } from 'aws-sdk';

export class DynamoService {
  private client: DynamoDB.DocumentClient;

  constructor() {
    this.client = new DynamoDB.DocumentClient();
  }

  async putItem(tableName: string, item: any) {
    await this.client.put({ TableName: tableName, Item: item }).promise();
  }

  async getItem(tableName: string, key: any) {
    const result = await this.client.get({ TableName: tableName, Key: key }).promise();
    return result.Item;
  }

  async queryItems(params: DynamoDB.DocumentClient.QueryInput) {
    const result = await this.client.query(params).promise();
    return result.Items || [];
  }

  async deleteItem(tableName: string, key: any) {
    await this.client.delete({ TableName: tableName, Key: key }).promise();
  }
}
