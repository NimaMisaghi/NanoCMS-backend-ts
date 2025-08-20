// src/lambdas/templates/templates.handler.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { getTemplate, createTemplate, updateTemplate } from './templates.service';
import { authMiddleware } from '../../shared/middleware/authMiddleware';

export const createTemplateHandler: APIGatewayProxyHandler = authMiddleware(async (event) => {
  const user = (event as any).user;
  const {
    name,
    description,
    header_structure,
    body_structure,
    footer_structure,
    css_structure,
    js_structure,
  } = JSON.parse(event.body || '{}');

  const template = await createTemplate({
    name,
    description,
    header_structure,
    body_structure,
    footer_structure,
    css_structure,
    js_structure,
    userId: user.userId,
  });

  return { statusCode: 201, body: JSON.stringify(template) };
});

export const updateTemplateHandler: APIGatewayProxyHandler = authMiddleware(async (event) => {
  const id = event.pathParameters?.id!;
  const updates = JSON.parse(event.body || '{}');

  const updated = await updateTemplate(id, updates);
  return { statusCode: 200, body: JSON.stringify(updated) };
});

export const getTemplateHandler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;
  if (!id) return { statusCode: 400, body: JSON.stringify({ message: 'Template ID is required' }) };

  const template = await getTemplate(id);
  if (!template)
    return { statusCode: 404, body: JSON.stringify({ message: 'Template not found' }) };

  return { statusCode: 200, body: JSON.stringify(template) };
};
