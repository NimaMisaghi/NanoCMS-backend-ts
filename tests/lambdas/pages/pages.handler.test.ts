import { createPageHandler, updatePageHandler } from '../../../src/lambdas/pages/pages.handler';
import * as service from '../../../src/lambdas/pages/pages.service';
import { authMiddleware } from '../../../src/shared/middleware/authMiddleware';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

jest.mock('../../../src/lambdas/pages/pages.service');
jest.mock('../../../src/shared/middleware/authMiddleware');

describe('Page Handler', () => {
  const context = {} as Context;
  const mockCreate = service.createPage as jest.Mock;
  const mockUpdate = service.updatePage as jest.Mock;
  const mockAuth = authMiddleware as jest.Mock;

  beforeEach(() => jest.clearAllMocks());

  it('should create page when auth passes', async () => {
    mockAuth.mockImplementation(async (_e, _ctx, next) => next());
    mockCreate.mockResolvedValue({ id: 'page-1', title: 'Home', createdUser: 'user-123' });

    const event = {
      body: JSON.stringify({ title: 'Home', html_structure: '<div></div>' }),
      headers: { Authorization: 'Bearer token' },
    } as unknown as APIGatewayProxyEvent;

    const response = (await createPageHandler(event, context, () => {})) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body).id).toBe('page-1');
  });

  it('should update page', async () => {
    mockAuth.mockImplementation(async (_e, _ctx, next) => next());
    mockUpdate.mockResolvedValue({ id: 'page-1', title: 'About', updatedUser: 'user-123' });

    const event = {
      body: JSON.stringify({ title: 'About' }),
      pathParameters: { id: 'page-1' },
      headers: { Authorization: 'Bearer token' },
    } as unknown as APIGatewayProxyEvent;

    const response = (await updatePageHandler(event, context, () => {})) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).title).toBe('About');
  });
});
