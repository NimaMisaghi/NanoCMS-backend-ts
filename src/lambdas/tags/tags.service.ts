// src/lambdas/tags/tags.service.ts
import { Tag, BaseEntity } from '../../shared/types';
import DB from '../../shared/db';

const pool = DB.getPostgresPool();

export const createTag = async (
  tag: Omit<Tag, 'id' | keyof BaseEntity> & { userId: string },
): Promise<Tag> => {
  const now = new Date().toISOString();
  const newTag: Tag = {
    ...tag,
    id: Date.now().toString(),
    createdAt: now,
    createdUser: tag.userId,
    updatedAt: now,
    updatedUser: tag.userId,
  };

  await pool.query(
    'INSERT INTO tags (id, name, description, created_at, updated_at, created_user, updated_user) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [
      newTag.id,
      newTag.name,
      newTag.description || null,
      newTag.createdAt,
      newTag.updatedAt,
      newTag.createdUser,
      newTag.updatedUser,
    ],
  );

  return newTag;
};

export const updateTag = async (
  id: string,
  updates: Partial<Omit<Tag, keyof BaseEntity>> & { userId: string },
): Promise<Tag> => {
  const existing = await getTag(id);
  if (!existing) throw new Error('Tag not found');

  const updated: Tag = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
    updatedUser: updates.userId,
  };

  await pool.query(
    'UPDATE tags SET name=$1, description=$2, updated_at=$3, updated_user=$4 WHERE id=$5',
    [updated.name, updated.description || null, updated.updatedAt, updated.updatedUser, id],
  );

  return updated;
};

export const getTag = async (id: string): Promise<Tag | null> => {
  const result = await pool.query('SELECT * FROM tags WHERE id=$1', [id]);
  if (result.rows.length === 0) return null;
  return result.rows[0] as Tag;
};

export const getAllTags = async (): Promise<Tag[]> => {
  const result = await pool.query('SELECT * FROM tags ORDER BY name ASC');
  return result.rows as Tag[];
};

export const deleteTag = async (id: string): Promise<void> => {
  await pool.query('DELETE FROM tags WHERE id=$1', [id]);
};
