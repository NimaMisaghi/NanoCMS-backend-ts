// tests/lambdas/categories/categories.service.test.ts
import { Pool } from 'pg';
import * as CategoryService from '../../../src/lambdas/categories/categories.service';

// --- Mock Postgres Pool ---
jest.mock('pg', () => {
  const mockQuery = jest.fn();
  return {
    Pool: jest.fn(() => ({
      query: mockQuery,
    })),
    __mockQuery: mockQuery,
  };
});

const mockQuery = (Pool as unknown as { __mockQuery: jest.Mock }).__mockQuery;

describe('Category Service (Postgres)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a category', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 'cat-1',
          name: 'Tech',
          description: 'Tech category',
          parent_category_id: null,
          template_id: null,
          created_at: '2024-01-01',
          created_user: 'user-1',
        },
      ],
    });

    const category = await CategoryService.createCategory({
      name: 'Tech',
      description: 'Tech category',
      userId: 'user-1',
    });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO categories'),
      expect.any(Array),
    );
    expect(category.id).toBe('cat-1');
    expect(category.name).toBe('Tech');
  });

  it('should update a category', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 'cat-1',
          name: 'Updated',
          description: 'Updated desc',
          updated_user: 'user-1',
        },
      ],
    });

    const updated = await CategoryService.updateCategory('cat-1', {
      name: 'Updated',
      description: 'Updated desc',
      userId: 'user-1',
    });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE categories'),
      expect.any(Array),
    );
    expect(updated.name).toBe('Updated');
  });

  it('should get a category by id', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 'cat-1', name: 'Tech' }],
    });

    const cat = await CategoryService.getCategory('cat-1');

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('SELECT * FROM categories WHERE id = $1'),
      ['cat-1'],
    );
    expect(cat?.id).toBe('cat-1');
  });

  it('should return null if category not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const cat = await CategoryService.getCategory('does-not-exist');
    expect(cat).toBeNull();
  });
});
