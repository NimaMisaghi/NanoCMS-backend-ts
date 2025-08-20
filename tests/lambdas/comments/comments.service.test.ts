import { Pool } from 'pg';
import DB from '../../../src/shared/db';
import { createComment, approveComment } from '../../../src/lambdas/comments/comments.service';

// mock db pool
jest.mock('pg', () => {
  const mClient = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mClient) };
});

describe('Comment Service', () => {
  let pool: jest.Mocked<Pool>;

  beforeAll(() => {
    pool = DB.getPostgresPool() as unknown as jest.Mocked<Pool>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a comment with approved = false by default', async () => {
    const mockRow = {
      id: 'c1',
      post_id: 'p1',
      user_id: 'u1',
      content: 'hello world',
      author_name: 'Anonymous',
      created_at: '2025-08-19T12:00:00.000Z',
      created_user: 'u1',
      approved: false,
    };

    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockRow] });

    const result = await createComment({
      postId: 'p1',
      content: 'hello world',
      userId: 'u1',
    });

    expect(pool.query).toHaveBeenCalled();
    expect(result.approved).toBe(false);
    expect(result.content).toBe('hello world');
  });

  it('should approve a comment', async () => {
    const mockRow = {
      id: 'c1',
      post_id: 'p1',
      user_id: 'u1',
      content: 'hello world',
      author_name: 'Anonymous',
      created_at: '2025-08-19T12:00:00.000Z',
      created_user: 'u1',
      approved: true,
      updated_at: '2025-08-19T12:05:00.000Z',
      updated_user: 'admin1',
    };

    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockRow] });

    const result = await approveComment('c1', 'admin1');

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE comments SET approved'),
      expect.arrayContaining(['c1', 'admin1']),
    );
    expect(result.approved).toBe(true);
    expect(result.updatedUser).toBe('admin1');
  });
});
