// src/lambdas/templates/templates.handler.test.ts
import {
  createTemplateHandler,
  updateTemplateHandler,
  getTemplateHandler,
} from '../../../src/lambdas/templates/templates.handler';
import * as service from '../../../src/lambdas/templates/templates.service';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

jest.mock('../../../src/lambdas/templates/templates.service');

describe('Template Handlers', () => {
  const mockUser = { userId: 'user1' };

  const mockEvent = (body?: object, pathParameters?: any): APIGatewayProxyEvent => ({
    body: body ? JSON.stringify(body) : null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/templates',
    pathParameters: pathParameters || null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: '',
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTemplateHandler', () => {
    it('should create a template and return 201', async () => {
      const templateData = {
        name: 'Template 1',
        description: 'desc',
        header_structure: '<header></header>',
        body_structure: '<body></body>',
        footer_structure: '<footer></footer>',
      };

      (service.createTemplate as jest.Mock).mockResolvedValue({
        id: '1',
        ...templateData,
        createdUser: mockUser.userId,
        createdAt: '2025-08-19T00:00:00.000Z',
      });

      const event = mockEvent(templateData);
      (event as any).user = mockUser;

      const result = (await createTemplateHandler(
        event,
        null as any,
        null as any,
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(201);
      const body = JSON.parse(result.body);
      expect(body.id).toBe('1');
      expect(body.name).toBe('Template 1');
      expect(service.createTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          ...templateData,
          createdUser: 'user1',
        }),
      );
    });
  });

  describe('updateTemplateHandler', () => {
    it('should update a template and return 200', async () => {
      const updates = { name: 'Updated Template' };
      const updatedTemplate = {
        id: '1',
        name: 'Updated Template',
        description: 'desc',
        header_structure: '<header></header>',
        body_structure: '<body></body>',
        footer_structure: '<footer></footer>',
        createdUser: 'user1',
        createdAt: '2025-08-19T00:00:00.000Z',
      };

      (service.updateTemplate as jest.Mock).mockResolvedValue(updatedTemplate);

      const event = mockEvent(updates, { id: '1' });

      const result = (await updateTemplateHandler(
        event,
        null as any,
        null as any,
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.name).toBe('Updated Template');
      expect(service.updateTemplate).toHaveBeenCalledWith('1', updates);
    });
  });

  describe('getTemplateHandler', () => {
    it('should return template when exists', async () => {
      const template = {
        id: '1',
        name: 'Template 1',
        description: 'desc',
        header_structure: '<header></header>',
        body_structure: '<body></body>',
        footer_structure: '<footer></footer>',
        createdUser: 'user1',
        createdAt: '2025-08-19T00:00:00.000Z',
      };

      (service.getTemplate as jest.Mock).mockResolvedValue(template);

      const event = mockEvent(undefined, { id: '1' });

      const result = (await getTemplateHandler(
        event,
        null as any,
        null as any,
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.id).toBe('1');
      expect(service.getTemplate).toHaveBeenCalledWith('1');
    });

    it('should return 404 if template not found', async () => {
      (service.getTemplate as jest.Mock).mockResolvedValue(null);

      const event = mockEvent(undefined, { id: 'nonexistent' });

      const result = (await getTemplateHandler(
        event,
        null as any,
        null as any,
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(404);
      expect(JSON.parse(result.body).message).toBe('Template not found');
    });

    it('should return 400 if no id provided', async () => {
      const event = mockEvent();
      const result = (await getTemplateHandler(
        event,
        null as any,
        null as any,
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).message).toBe('Template ID is required');
    });
  });
});
