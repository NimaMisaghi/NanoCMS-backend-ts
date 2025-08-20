import {
  getTemplate,
  createTemplate,
  updateTemplate,
  getAllTemplates,
} from '../../../src/lambdas/templates/templates.service';
import DB from '../../../src/shared/db';
import { PoolClient } from 'pg';

jest.mock('../../../src/shared/db');

describe('Template Service', () => {
  let mockClient: Partial<PoolClient>;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
    };
    (DB.getPostgresPool as jest.Mock).mockReturnValue({
      connect: jest.fn().mockResolvedValue(mockClient),
    });
  });

  afterEach(() => jest.clearAllMocks());

  it('should fetch all templates', async () => {
    const rows = [
      {
        id: '1',
        name: 'T1',
        description: 'desc',
        header_structure: '',
        body_structure: '',
        footer_structure: '',
        created_at: '2025-08-19',
        created_user: 'user1',
      },
    ];
    (mockClient.query as jest.Mock).mockResolvedValue({ rows });

    const result = await getAllTemplates();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
    expect(result[0].createdUser).toBe('user1');
  });

  it('should create a new template', async () => {
    const templateData = {
      name: 'New',
      description: 'desc',
      header_structure: '',
      body_structure: '',
      footer_structure: '',
      userId: 'user1',
    };
    (mockClient.query as jest.Mock).mockResolvedValue({
      rows: [{ ...templateData, id: '2', created_at: '2025-08-19', created_user: 'user1' }],
    });

    const newTemplate = await createTemplate(templateData);
    expect(newTemplate.id).toBe('2');
    expect(newTemplate.name).toBe('New');
    expect(mockClient.query).toHaveBeenCalled();
  });

  it('should update a template', async () => {
    const existingTemplate = {
      id: '2',
      name: 'Old',
      description: '',
      header_structure: '',
      body_structure: '',
      footer_structure: '',
      created_at: '2025-08-19',
      created_user: 'user1',
    };
    (mockClient.query as jest.Mock)
      .mockResolvedValueOnce({ rows: [existingTemplate] }) // get by id
      .mockResolvedValueOnce({
        rows: [
          { ...existingTemplate, name: 'Updated', updated_at: '2025-08-19', updated_user: 'user2' },
        ],
      }); // update

    const updated = await updateTemplate('2', { name: 'Updated', userId: 'user2' });
    expect(updated.name).toBe('Updated');
    expect(updated.updatedUser).toBe('user2');
  });

  it('should return templates from database', async () => {
    const rows = [
      {
        id: '1',
        name: 'Template 1',
        description: 'Desc 1',
        header_structure: '<header></header>',
        body_structure: '<body></body>',
        footer_structure: '<footer></footer>',
        css_structure: null,
        js_structure: null,
        created_at: '2025-08-19',
        updated_at: null,
        created_user: 'user1',
        updated_user: null,
      },
    ];

    (mockClient.query as jest.Mock).mockResolvedValue({ rows });

    const template = await getTemplate(rows[0].id);
    expect(template).not.toBeNull();

    if (template) {
      expect(template.id).toBe('1');
      expect(template.name).toBe('Template 1');
      expect(template.createdUser).toBe('user1');
    }

    expect(mockClient.query).toHaveBeenCalledWith('SELECT * FROM templates WHERE id = $1', [
      rows[0].id,
    ]);
  });
});
