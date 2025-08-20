import { Comment, BaseEntity } from '../../shared/types';
import DB from '../../shared/db';

export const createComment = async (data: {
  postId: string;
  content: string;
  userId: string;
  authorName?: string;
}): Promise<Comment> => {
  const now = new Date().toISOString();
  const pool = DB.getPostgresPool();

  const query = `
    INSERT INTO comments (post_id, user_id, content, author_name, created_at, created_user, approved)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    data.postId,
    data.userId,
    data.content,
    data.authorName ?? 'Anonymous',
    now,
    data.userId,
    false,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateComment = async (
  id: string,
  updates: Partial<Omit<Comment, keyof BaseEntity>> & { userId: string },
): Promise<Comment> => {
  const pool = DB.getPostgresPool();
  const existing = await getComment(id);
  if (!existing) throw new Error('Comment not found');

  const updated: Comment = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
    updatedUser: updates.userId,
  };

  const query = `
    UPDATE comments
    SET content = $1, updated_at = $2, updated_user = $3
    WHERE id = $4
    RETURNING *;
  `;
  const values = [updated.content, updated.updatedAt, updated.updatedUser, id];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getComment = async (id: string): Promise<Comment | null> => {
  const pool = DB.getPostgresPool();
  const result = await pool.query(`SELECT * FROM comments WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

export const approveComment = async (id: string, userId: string): Promise<Comment> => {
  const pool = DB.getPostgresPool();
  const existing = await getComment(id);
  if (!existing) throw new Error('Comment not found');

  const updated: Comment = {
    ...existing,
    approved: true,
    updatedAt: new Date().toISOString(),
    updatedUser: userId,
  };

  const query = `
    UPDATE comments
    SET approved = $1, updated_at = $2, updated_user = $3
    WHERE id = $4
    RETURNING *;
  `;
  const values = [true, updated.updatedAt, updated.updatedUser, id];

  const result = await pool.query(query, values);
  return result.rows[0];
};
