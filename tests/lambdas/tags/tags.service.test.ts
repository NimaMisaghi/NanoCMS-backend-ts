// src/lambdas/tags/__tests__/tags.service.test.ts
import {
  createTag,
  updateTag,
  getTag,
  getAllTags,
  deleteTag,
} from '../../../src/lambdas/tags/tags.service';
import DB from '../../../src/shared/db';
import { Tag } from '../../../src/shared/types';

jest.mock('../../../src/shared/db');

const mockPool = {
  query: jest.fn(),
};

(DB.getPostgresPool as jest.Mock).mockReturnValue(mockPool);

describe('Tag Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a tag', async () => {
    mockPool.query.mockResolvedValueOnce({}); // insert

    const newTag = await createTag({
      name: 'Tech',
      description: 'Tech category',
      userId: 'user-1',
    });
    expect(newTag.id).toBeDefined();
    expect(newTag.name).toBe('Tech');
    expect(newTag.createdUser).toBe('user-1');
    expect(mockPool.query).toHaveBeenCalledTimes(1);
  });

  it('should update a tag', async () => {
    const existingTag: Tag = {
      id: 'tag-1',
      name: 'Old',
      description: 'Old desc',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdUser: 'user-1',
      updatedUser: 'user-1',
    };

    // getTag call
    mockPool.query.mockResolvedValueOnce({ rows: [existingTag] });

    // update call
    mockPool.query.mockResolvedValueOnce({});

    const updated = await updateTag('tag-1', { name: 'New', userId: 'user-2' });
    expect(updated.name).toBe('New');
    expect(updated.updatedUser).toBe('user-2');
    expect(mockPool.query).toHaveBeenCalledTimes(2);
  });

  it('should get all tags', async () => {
    const tags: Tag[] = [
      {
        id: 'tag-1',
        name: 'Tech',
        description: 'Tech',
        createdAt: '',
        createdUser: 'u1',
        updatedAt: '',
        updatedUser: 'u1',
      },
    ];
    mockPool.query.mockResolvedValueOnce({ rows: tags });

    const result = await getAllTags();
    expect(result).toEqual(tags);
  });

  it('should delete a tag', async () => {
    mockPool.query.mockResolvedValueOnce({});
    await deleteTag('tag-1');
    expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM tags WHERE id=$1', ['tag-1']);
  });
});
