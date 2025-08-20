import { APIGatewayProxyHandler } from 'aws-lambda';
import { registerUser, loginUser, verifyToken } from './auth.service';
import { authMiddleware } from '../../shared/middleware/authMiddleware';

export const register: APIGatewayProxyHandler = async (event) => {
  try {
    const { username, password, displayName, publishName, email } = JSON.parse(event.body || '{}');
    const user = await registerUser(username, password, displayName, publishName, email);
    return { statusCode: 201, body: JSON.stringify({ id: user.id, username: user.username }) };
  } catch (err: any) {
    return { statusCode: 400, body: err.message };
  }
};

export const login: APIGatewayProxyHandler = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body || '{}');
    const token = await loginUser(username, password);
    return { statusCode: 200, body: JSON.stringify({ token }) };
  } catch (err: any) {
    return { statusCode: 401, body: err.message };
  }
};

export const verify: APIGatewayProxyHandler = authMiddleware(async (event) => {
  return { statusCode: 200, body: JSON.stringify((event as any).user) };
});
