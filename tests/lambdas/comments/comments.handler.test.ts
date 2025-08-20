import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { create, approve } from '../../../src/lambdas/comments/comments.handler';
import * as commentService from '../../../src/lambdas/comments/comments.service';

// mock service functions
jest.mock('../../../src/lambdas/comments/comments.service');

describe('Comment Handlers', () => {
  const context = {} as Context;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a comment when authorized', async () => {
    const mockComment = {
      id: 'c1',
      postId: 'p1',
      userId: 'u1',
      content: 'test comment',
      authorName: 'Anonymous',
      createdAt: '2025-08-19T12:00:00.000Z',
      createdUser: 'u1',
      approved: false,
    };

    (commentService.createComment as jest.Mock).mockResolvedValue(mockComment);

    const event = {
      body: JSON.stringify({ postId: 'p1', content: 'test comment' }),
      headers: { Authorization: 'Bearer valid-token' },
    } as unknown as APIGatewayProxyEvent;

    const response = (await create(event, context, () => {})) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body).approved).toBe(false);
    expect(commentService.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        postId: 'p1',
        content: 'test comment',
        userId: expect.any(String),
      }),
    );
  });

  it('should approve a comment', async () => {
    const mockComment = {
      id: 'c1',
      postId: 'p1',
      userId: 'u1',
      content: 'test comment',
      authorName: 'Anonymous',
      createdAt: '2025-08-19T12:00:00.000Z',
      createdUser: 'u1',
      approved: true,
      updatedAt: '2025-08-19T12:05:00.000Z',
      updatedUser: 'admin1',
    };

    (commentService.approveComment as jest.Mock).mockResolvedValue(mockComment);

    const event = {
      pathParameters: { id: 'c1' },
      headers: { Authorization: 'Bearer valid-token' },
    } as unknown as APIGatewayProxyEvent;

    const response = (await approve(event, context, () => {})) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).approved).toBe(true);
    expect(commentService.approveComment).toHaveBeenCalledWith('c1', expect.any(String));
  });
});
