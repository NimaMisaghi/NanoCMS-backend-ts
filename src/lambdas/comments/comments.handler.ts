import { APIGatewayProxyHandler } from 'aws-lambda';
import { createComment, updateComment, approveComment } from './comments.service';
import { authMiddleware } from '../../shared/middleware/authMiddleware';

export const create: APIGatewayProxyHandler = authMiddleware(async (event) => {
  const user = (event as any).user;
  const { postId, content } = JSON.parse(event.body || '{}');

  if (!postId || !content) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'postId and content are required' }),
    };
  }

  const comment = await createComment({
    postId,
    content,
    userId: user.userId,
    authorName: user.publishName,
  });

  return { statusCode: 201, body: JSON.stringify(comment) };
});

export const update: APIGatewayProxyHandler = authMiddleware(async (event) => {
  const user = (event as any).user;
  const id = event.pathParameters?.id!;
  const updates = JSON.parse(event.body || '{}');

  const updated = await updateComment(id, { ...updates, userId: user.userId });
  return { statusCode: 200, body: JSON.stringify(updated) };
});

export const approve: APIGatewayProxyHandler = authMiddleware(async (event) => {
  const user = (event as any).user;
  const id = event.pathParameters?.id!;

  const approved = await approveComment(id, user.userId);
  return { statusCode: 200, body: JSON.stringify(approved) };
});
