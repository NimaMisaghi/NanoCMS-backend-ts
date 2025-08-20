import {
  createCategoryHandler,
  updateCategoryHandler,
} from '../../../src/lambdas/categories/categories.handler';
import * as service from '../../../src/lambdas/categories/categories.service';
import { authMiddleware } from '../../../src/shared/middleware/authMiddleware';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

jest.mock('../../../src/lambdas/categories/categories.service');
jest.mock('../../../src/shared/middleware/authMiddleware');

describe('Category Handlers', () => {
  const mockCreateCategory = service.createCategory as jest.Mock;
  const mockUpdateCategory = service.updateCategory as jest.Mock;
  const mockAuth = authMiddleware as jest.Mock;

  const context = {} as Context;

  const callback = (_error: any, result?: APIGatewayProxyResult) => {
    return result;
  };

  beforeEach(() => jest.clearAllMocks());

  it('should create category when auth passes', async () => {
    mockAuth.mockImplementation(async (_event, _context, next) => next());
    mockCreateCategory.mockResolvedValue({ id: 'cat-1', name: 'Tech', createdUser: 'user-123' });

    const event = {
      body: JSON.stringify({ name: 'Tech' }),
      headers: { Authorization: 'Bearer valid-token' },
    } as unknown as APIGatewayProxyEvent;

    const response = (await createCategoryHandler(
      event,
      context,
      callback,
    )) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body).id).toBe('cat-1');
  });

  it('should update category when auth passes', async () => {
    mockAuth.mockImplementation(async (_e, _ctx, next) => next());
    mockUpdateCategory.mockResolvedValue({
      id: 'cat-1',
      name: 'Tech Updated',
      updatedUser: 'user-123',
    });

    const event = {
      body: JSON.stringify({ name: 'Tech Updated' }),
      headers: { Authorization: 'Bearer valid-token' },
      pathParameters: { id: 'cat-1' },
    } as unknown as APIGatewayProxyEvent;

    const response = (await updateCategoryHandler(
      event,
      context,
      callback,
    )) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).name).toBe('Tech Updated');
  });

  it('should return 401 if auth fails', async () => {
    mockAuth.mockImplementation(async () => {
      throw new Error('Unauthorized');
    });

    const event = { body: '{}', headers: {} } as unknown as APIGatewayProxyEvent;
    await expect(createCategoryHandler(event, context, callback)).rejects.toThrow('Unauthorized');
  });
});
