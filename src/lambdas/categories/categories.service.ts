// src/lambdas/categories/categories.service.ts
import DB from '../../shared/db';
import { Category, BaseEntity } from '../../shared/types';

const pool = DB.getPostgresPool();

export const createCategory = async (
  category: Omit<Category, 'id' | keyof BaseEntity> & { userId: string },
): Promise<Category> => {
  const now = new Date().toISOString();
  const query = `
    INSERT INTO categories (name, description, parent_category_id, template_id, created_at, created_user)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    category.name,
    category.description,
    category.parentCategoryId ?? null,
    category.templateId ?? null,
    now,
    category.userId,
  ];

  const result = await pool.query(query, values);
  return result.rows[0] as Category;
};

export const updateCategory = async (
  id: string,
  updates: Partial<Omit<Category, keyof BaseEntity>> & { userId: string },
): Promise<Category> => {
  const now = new Date().toISOString();
  const query = `
    UPDATE categories
    SET name = COALESCE($1, name),
        description = COALESCE($2, description),
        parent_category_id = COALESCE($3, parent_category_id),
        template_id = COALESCE($4, template_id),
        updated_at = $5,
        updated_user = $6
    WHERE id = $7
    RETURNING *;
  `;

  const values = [
    updates.name ?? null,
    updates.description ?? null,
    updates.parentCategoryId ?? null,
    updates.templateId ?? null,
    now,
    updates.userId,
    id,
  ];

  const result = await pool.query(query, values);
  if (result.rows.length === 0) throw new Error('Category not found');
  return result.rows[0] as Category;
};

export const getCategory = async (id: string): Promise<Category | null> => {
  const query = `SELECT * FROM categories WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};
