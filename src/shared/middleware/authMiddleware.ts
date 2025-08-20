import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export interface AuthenticatedEvent extends APIGatewayProxyEvent {
  user: {
    userId: string;
    username: string;
    roles?: string[];
  };
}

export class AuthMiddleware {
  constructor(
    private readonly verifyToken: (token: string) => { userId: string; username: string },
  ) {}

  handler = (
    next: (event: AuthenticatedEvent) => Promise<APIGatewayProxyResult>,
  ): APIGatewayProxyHandler => {
    return async (event, context) => {
      try {
        const authHeader = event.headers['Authorization'] || event.headers['authorization'];
        if (!authHeader) return { statusCode: 401, body: 'Unauthorized' };

        const token = authHeader.split(' ')[1];
        const user = this.verifyToken(token);

        const authEvent = event as AuthenticatedEvent;
        authEvent.user = user;

        // Make sure next always returns APIGatewayProxyResult
        return await next(authEvent);
      } catch (err) {
        return { statusCode: 401, body: 'Unauthorized' };
      }
    };
  };
}

// Example usage
export const authMiddleware = new AuthMiddleware((token) => {
  return { userId: '123', username: 'nima' };
}).handler;
