import { User } from '../../shared/types';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.USERS_TABLE!;
const JWT_SECRET = process.env.JWT_SECRET!;

export const registerUser = async (
  username: string,
  password: string,
  displayName: string,
  publishName: string,
  email?: string,
): Promise<User> => {
  const existing = await dynamo.get({ TableName: TABLE_NAME, Key: { username } }).promise();
  if (existing.Item) throw new Error('Username already exists');

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = Date.now().toString();
  const user: User = {
    id: userId,
    username,
    displayName,
    publishName,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
    createdUser: userId,
  };

  await dynamo.put({ TableName: TABLE_NAME, Item: user }).promise();
  return user;
};

export const loginUser = async (username: string, password: string): Promise<string> => {
  const res = await dynamo.get({ TableName: TABLE_NAME, Key: { username } }).promise();
  const user = res.Item as User | undefined;
  if (!user) throw new Error('Invalid username or password');

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error('Invalid username or password');

  return jwt.sign(
    { userId: user.id, username: user.username, publishName: user.publishName },
    JWT_SECRET,
    { expiresIn: '1h' },
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
