import DB from '../../shared/db';
import { Post, BaseEntity } from '../../shared/types';

const TABLE_NAME = 'posts';

export const createPost = async (
  post: Omit<Post, 'id' | keyof BaseEntity> & { authorId: string },
): Promise<Post> => {
  const now = new Date().toISOString();
  const newPost = {
    ...post,
    id: Date.now().toString(),
    created_at: now,
    updated_at: null,
    created_user: post.authorId,
    updated_user: null,
  };

  const pool = DB.getPostgresPool();
  const query = `
    INSERT INTO posts (id, title, content, description, author_id, publish_name, template_id, category_id, tag_ids, created_at, updated_at, created_user, updated_user)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *;
  `;
  const values = [
    newPost.id,
    newPost.title,
    newPost.content,
    newPost.description,
    newPost.authorId,
    newPost.publishName,
    newPost.templateId || null,
    newPost.categoryId || null,
    newPost.tagIds || [],
    newPost.created_at,
    newPost.updated_at,
    newPost.created_user,
    newPost.updated_user,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updatePost = async (
  id: string,
  updates: Partial<Omit<Post, keyof BaseEntity>> & { authorId: string },
): Promise<Post> => {
  const pool = DB.getPostgresPool();
  const now = new Date().toISOString();

  const existingResult = await pool.query('SELECT * FROM posts WHERE id=$1', [id]);
  if (!existingResult.rows.length) throw new Error('Post not found');
  const existing = existingResult.rows[0];

  const updated = {
    ...existing,
    ...updates,
    updated_at: now,
    updated_user: updates.authorId,
  };

  const query = `
    UPDATE posts
    SET title=$1, content=$2, description=$3, author_id=$4, publish_name=$5,
        template_id=$6, category_id=$7, tag_ids=$8, updated_at=$9, updated_user=$10
    WHERE id=$11
    RETURNING *;
  `;

  const values = [
    updated.title,
    updated.content,
    updated.description,
    updated.authorId,
    updated.publishName,
    updated.templateId || null,
    updated.categoryId || null,
    updated.tagIds || [],
    updated.updated_at,
    updated.updated_user,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
