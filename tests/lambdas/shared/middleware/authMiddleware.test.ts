import { authMiddleware } from '../../src/shared/authMiddleware';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

describe('Auth Middleware', () => {
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next if Authorization header is valid', async () => {
    const event = {
      headers: { Authorization: 'Bearer valid-token' },
    } as unknown as APIGatewayProxyEvent;
    const context = {} as Context;

    await authMiddleware(event, context, next);

    expect(next).toHaveBeenCalled();
  });

  it('should throw error if Authorization header is missing', async () => {
    const event = { headers: {} } as unknown as APIGatewayProxyEvent;
    const context = {} as Context;

    await expect(authMiddleware(event, context, next)).rejects.toThrow('Unauthorized');
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw error if token is invalid', async () => {
    const event = {
      headers: { Authorization: 'Bearer invalid-token' },
    } as unknown as APIGatewayProxyEvent;
    const context = {} as Context;

    await expect(authMiddleware(event, context, next)).rejects.toThrow('Unauthorized');
    expect(next).not.toHaveBeenCalled();
  });
});
