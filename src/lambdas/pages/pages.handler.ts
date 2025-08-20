import { APIGatewayProxyHandler } from 'aws-lambda';
import { createPage, updatePage } from './pages.service';
import { authMiddleware } from '../../shared/middleware/authMiddleware';

export const createPageHandler: APIGatewayProxyHandler = authMiddleware(async (event) => {
  const user = (event as any).user;
  const body = JSON.parse(event.body || '{}');

  const page = await createPage({
    ...body,
    authorId: user.userId,
  });

  return { statusCode: 201, body: JSON.stringify(page) };
});

export const updatePageHandler: APIGatewayProxyHandler = authMiddleware(async (event) => {
  const user = (event as any).user;
  const id = event.pathParameters?.id!;
  const updates = JSON.parse(event.body || '{}');

  const updated = await updatePage(id, { ...updates, authorId: user.userId });
  return { statusCode: 200, body: JSON.stringify(updated) };
});
