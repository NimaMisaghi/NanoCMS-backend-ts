import { createPostHandler, updatePostHandler } from '../../../src/lambdas/posts/posts.handler';
import { createPost, updatePost } from '../../../src/lambdas/posts/posts.service';
import { authMiddleware } from '../../../src/shared/middleware/authMiddleware';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

jest.mock('../../../src/lambdas/posts/posts.service');
jest.mock('../../../src/shared/middleware/authMiddleware');

describe('Post Handler', () => {
  const mockCreate = createPost as jest.Mock;
  const mockUpdate = updatePost as jest.Mock;
  const mockAuth = authMiddleware as jest.Mock;

  beforeEach(() => jest.clearAllMocks());

  it('should create post when auth passes', async () => {
    mockAuth.mockImplementation(async (_e, _ctx, next) => next());
    mockCreate.mockResolvedValue({ id: 'post-1', title: 'Test Post', authorId: 'user-1' });

    const event = {
      body: JSON.stringify({
        title: 'Test Post',
        content: 'Content',
        description: 'Desc',
        publishName: 'test-post',
      }),
      headers: { Authorization: 'Bearer valid-token' },
    } as unknown as APIGatewayProxyEvent;

    const response = (await createPostHandler(event, {} as any, () => {})) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body).id).toBe('post-1');
  });

  it('should return 400 if create fails', async () => {
    mockAuth.mockImplementation(async (_e, _ctx, next) => next());
    mockCreate.mockRejectedValue(new Error('Failed'));

    const event = { body: '{}' } as unknown as APIGatewayProxyEvent;
    const response = (await createPostHandler(event, {} as any, () => {})) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe('Failed');
  });

  it('should update post when auth passes', async () => {
    mockAuth.mockImplementation(async (_e, _ctx, next) => next());
    mockUpdate.mockResolvedValue({ id: 'post-1', title: 'Updated' });

    const event = {
      pathParameters: { id: 'post-1' },
      body: JSON.stringify({ title: 'Updated' }),
    } as unknown as APIGatewayProxyEvent;

    const response = (await updatePostHandler(event, {} as any, () => {})) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).title).toBe('Updated');
  });
});
