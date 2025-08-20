import { createPost, updatePost } from '../../../src/lambdas/posts/posts.service';
import DB from '../../../src/shared/db';

jest.mock('../../shared/db');

describe('Post Service', () => {
  const mockQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (DB.getPostgresPool as jest.Mock).mockReturnValue({ query: mockQuery });
  });

  it('should create a post', async () => {
    const postData = {
      title: 'New Post',
      content: 'Content here',
      description: 'Desc',
      authorId: 'user-1',
      publishName: 'post-name',
      templateId: 'tmpl-1',
      categoryId: 'cat-1',
      tagIds: ['tag-1', 'tag-2'],
    };

    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          ...postData,
          id: '123',
          created_at: '2025-08-19T00:00:00Z',
          updated_at: null,
          created_user: 'user-1',
          updated_user: null,
        },
      ],
    });

    const result = await createPost(postData);
    expect(result.id).toBe('123');
    expect(result.title).toBe('New Post');
    expect(mockQuery).toHaveBeenCalled();
  });

  it('should update a post', async () => {
    const existingPost = {
      id: '123',
      title: 'Old Post',
      content: 'Old content',
      description: 'Old desc',
      authorId: 'user-1',
      publishName: 'old-name',
      templateId: null,
      categoryId: null,
      tagIds: [],
      created_at: '2025-08-18T00:00:00Z',
      updated_at: null,
      created_user: 'user-1',
      updated_user: null,
    };

    mockQuery.mockResolvedValueOnce({ rows: [existingPost] }).mockResolvedValueOnce({
      rows: [
        {
          ...existingPost,
          title: 'Updated Post',
          updated_at: '2025-08-19T00:00:00Z',
          updated_user: 'user-1',
        },
      ],
    });

    const result = await updatePost('123', { title: 'Updated Post', authorId: 'user-1' });
    expect(result.title).toBe('Updated Post');
    expect(mockQuery).toHaveBeenCalledTimes(2);
  });

  it('should throw if post not found on update', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await expect(updatePost('999', { title: 'No Post', authorId: 'user-1' })).rejects.toThrow(
      'Post not found',
    );
  });
});
