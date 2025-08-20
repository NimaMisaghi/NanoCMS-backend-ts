import { APIGatewayProxyHandler } from 'aws-lambda';
import { createCategory, updateCategory } from './categories.service';
import { authMiddleware } from '../../shared/middleware/authMiddleware';

export const createCategoryHandler: APIGatewayProxyHandler = authMiddleware(async (event) => {
  const user = (event as any).user;
  const { name, description } = JSON.parse(event.body || '{}');

  const category = await createCategory({
    name,
    description,
    userId: user.userId,
  });

  return { statusCode: 201, body: JSON.stringify(category) };
});

export const updateCategoryHandler: APIGatewayProxyHandler = authMiddleware(async (event) => {
  const user = (event as any).user;
  const id = event.pathParameters?.id!;
  const updates = JSON.parse(event.body || '{}');

  const updated = await updateCategory(id, { ...updates, userId: user.userId });
  return { statusCode: 200, body: JSON.stringify(updated) };
});
