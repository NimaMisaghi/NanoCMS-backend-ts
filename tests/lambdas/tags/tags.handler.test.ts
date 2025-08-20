// tests/lambdas/tags/tags.handler.test.ts
import {
  createTagHandler,
  updateTagHandler,
  getTagHandler,
  getAllTagsHandler,
  deleteTagHandler,
} from '../../../src/lambdas/tags/tags.handler';
import * as tagService from '../../../src/lambdas/tags/tags.service';
import { authMiddleware } from '../../../src/shared/middleware/authMiddleware';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

jest.mock('../../../src/lambdas/tags/tags.service');
jest.mock('../../../src/shared/middleware/authMiddleware');

describe('Tag Handlers', () => {
  const context = {} as Context;
  const mockCreateTag = tagService.createTag as jest.Mock;
  const mockUpdateTag = tagService.updateTag as jest.Mock;
  const mockGetTag = tagService.getTag as jest.Mock;
  const mockGetAllTags = tagService.getAllTags as jest.Mock;
  const mockDeleteTag = tagService.deleteTag as jest.Mock;
  const mockAuth = authMiddleware as jest.Mock;

  beforeEach(() => jest.clearAllMocks());

  it('should create a tag when auth passes', async () => {
    mockAuth.mockImplementation(async (_e, _ctx, next) => next());
    mockCreateTag.mockResolvedValue({ id: 'tag-1', name: 'Tech', createdUser: 'user-123' });

    const event = {
      body: JSON.stringify({ name: 'Tech', description: 'Tech stuff' }),
      headers: { Authorization: 'Bearer valid-token' },
    } as unknown as APIGatewayProxyEvent;

    const response = (await createTagHandler(event, context, {} as any)) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body).id).toBe('tag-1');
  });

  it('should update a tag', async () => {
    mockAuth.mockImplementation(async (_e, _ctx, next) => next());
    mockUpdateTag.mockResolvedValue({ id: 'tag-1', name: 'Updated' });

    const event = {
      pathParameters: { id: 'tag-1' },
      body: JSON.stringify({ name: 'Updated' }),
      headers: { Authorization: 'Bearer valid-token' },
    } as unknown as APIGatewayProxyEvent;

    const response = (await updateTagHandler(event, context, {} as any)) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).name).toBe('Updated');
  });

  it('should get a tag', async () => {
    mockGetTag.mockResolvedValue({ id: 'tag-1', name: 'Tech' });

    const event = { pathParameters: { id: 'tag-1' } } as unknown as APIGatewayProxyEvent;
    const response = (await getTagHandler(event, context, {} as any)) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).id).toBe('tag-1');
  });

  it('should return 404 if tag not found', async () => {
    mockGetTag.mockResolvedValue(null);
    const event = { pathParameters: { id: 'unknown' } } as unknown as APIGatewayProxyEvent;
    const response = (await getTagHandler(event, context, {} as any)) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(404);
  });

  it('should get all tags', async () => {
    mockGetAllTags.mockResolvedValue([{ id: 'tag-1', name: 'Tech' }]);
    const response = (await getAllTagsHandler(
      {} as APIGatewayProxyEvent,
      context,
      {} as any,
    )) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).length).toBe(1);
  });

  it('should delete a tag', async () => {
    mockAuth.mockImplementation(async (_e, _ctx, next) => next());
    mockDeleteTag.mockResolvedValue(undefined);

    const event = {
      pathParameters: { id: 'tag-1' },
      headers: { Authorization: 'Bearer token' },
    } as unknown as APIGatewayProxyEvent;
    const response = (await deleteTagHandler(event, context, {} as any)) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(204);
  });
});
