// src/lambdas/tags/tags.handler.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createTag, updateTag, getTag, getAllTags, deleteTag } from './tags.service';
import { authMiddleware } from '../../shared/middleware/authMiddleware';

export const createTagHandler: APIGatewayProxyHandler = authMiddleware(async (event) => {
  const user = (event as any).user;
  const { name, description } = JSON.parse(event.body || '{}');

  const tag = await createTag({ name, description, userId: user.userId });

  return { statusCode: 201, body: JSON.stringify(tag) };
});

export const updateTagHandler: APIGatewayProxyHandler = authMiddleware(async (event) => {
  const user = (event as any).user;
  const id = event.pathParameters?.id!;
  const updates = JSON.parse(event.body || '{}');

  const updated = await updateTag(id, { ...updates, userId: user.userId });
  return { statusCode: 200, body: JSON.stringify(updated) };
});

export const getTagHandler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id!;
  const tag = await getTag(id);
  if (!tag) return { statusCode: 404, body: 'Tag not found' };
  return { statusCode: 200, body: JSON.stringify(tag) };
};

export const getAllTagsHandler: APIGatewayProxyHandler = async () => {
  const tags = await getAllTags();
  return { statusCode: 200, body: JSON.stringify(tags) };
};

export const deleteTagHandler: APIGatewayProxyHandler = authMiddleware(async (event) => {
  const id = event.pathParameters?.id!;
  await deleteTag(id);
  return { statusCode: 204, body: '' };
});
