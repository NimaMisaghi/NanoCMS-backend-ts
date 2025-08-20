import { createPage, updatePage } from '../../../src/lambdas/pages/pages.service';
import DB from '../../../src/shared/db';
import { Pool } from 'pg';

jest.mock('../../../src/shared/db');

describe('Page Service', () => {
  const mockQuery = jest.fn();

  beforeAll(() => {
    // @ts-ignore
    DB.getPostgresPool.mockReturnValue({ query: mockQuery } as Pool);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a page', async () => {
    const mockResult = { rows: [{ id: 'page-1', title: 'Home', created_user: 'user-123' }] };
    mockQuery.mockResolvedValue(mockResult);

    const pageData = {
      title: 'Home',
      description: 'Desc',
      html_structure: '<div></div>',
      authorId: 'user-123',
    };
    const result = await createPage(pageData);

    expect(mockQuery).toHaveBeenCalled();
    expect(result.id).toBe('page-1');
    expect(result.title).toBe('Home');
  });

  it('should update a page', async () => {
    const mockResult = { rows: [{ id: 'page-1', title: 'About', updated_user: 'user-123' }] };
    mockQuery.mockResolvedValue(mockResult);

    const updates = { title: 'About', authorId: 'user-123' };
    const result = await updatePage('page-1', updates);

    expect(mockQuery).toHaveBeenCalled();
    expect(result.title).toBe('About');
  });

  it('should throw if page not found on update', async () => {
    const mockResult = { rows: [] };
    mockQuery.mockResolvedValue(mockResult);

    await expect(updatePage('nonexistent', { title: 'X', authorId: 'user-123' })).rejects.toThrow(
      'Page not found',
    );
  });
});
