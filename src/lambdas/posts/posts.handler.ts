import { APIGatewayProxyHandler } from 'aws-lambda';
import { createPost, updatePost } from './posts.service';
import { authMiddleware } from '../../shared/middleware/authMiddleware';

export const createPostHandler: APIGatewayProxyHandler = authMiddleware(async (event) => {
  try {
    const user = (event as any).user;
    const data = JSON.parse(event.body || '{}');

    const post = await createPost({
      ...data,
      authorId: user.userId,
    });

    return { statusCode: 201, body: JSON.stringify(post) };
  } catch (err: any) {
    return { statusCode: 400, body: JSON.stringify({ message: err.message }) };
  }
});

export const updatePostHandler: APIGatewayProxyHandler = authMiddleware(async (event) => {
  try {
    const user = (event as any).user;
    const id = event.pathParameters?.id!;
    const updates = JSON.parse(event.body || '{}');

    const updated = await updatePost(id, { ...updates, authorId: user.userId });
    return { statusCode: 200, body: JSON.stringify(updated) };
  } catch (err: any) {
    return { statusCode: 400, body: JSON.stringify({ message: err.message }) };
  }
});
