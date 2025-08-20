// src/shared/db.mock.ts

export class MockDB {
  private static dynamoData: Record<string, any[]> = {};
  private static pgData: Record<string, any[]> = {};

  // --- Mock DynamoDB ---
  static async putDynamo(table: string, item: any) {
    if (!MockDB.dynamoData[table]) MockDB.dynamoData[table] = [];
    MockDB.dynamoData[table].push(item);
    return item;
  }

  static async getDynamo(table: string, key: any) {
    const items = MockDB.dynamoData[table] || [];
    return items.find((i) => i.userId === key.userId) || null;
  }

  // --- Mock Postgres ---
  static async insertPg(table: string, row: any) {
    if (!MockDB.pgData[table]) MockDB.pgData[table] = [];
    MockDB.pgData[table].push({ id: `${table}-${MockDB.pgData[table].length + 1}`, ...row });
    return MockDB.pgData[table].slice(-1)[0];
  }

  static async selectPg(table: string, filter?: (row: any) => boolean) {
    const rows = MockDB.pgData[table] || [];
    return filter ? rows.filter(filter) : rows;
  }

  static reset() {
    MockDB.dynamoData = {};
    MockDB.pgData = {};
  }
}
