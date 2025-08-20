// src/lambdas/templates/templates.service.ts
import DB from '../../shared/db';
import { Template, BaseEntity } from '../../shared/types';

const pool = DB.getPostgresPool();

export const createTemplate = async (
  template: Omit<Template, 'id' | keyof BaseEntity> & { userId: string },
): Promise<Template> => {
  const now = new Date().toISOString();
  const result = await pool.query(
    `INSERT INTO templates 
      (name, description, header_structure, body_structure, footer_structure, css_structure, js_structure, created_at, created_user)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [
      template.name,
      template.description,
      template.header_structure,
      template.body_structure,
      template.footer_structure,
      template.css_structure || null,
      template.js_structure || null,
      now,
      template.userId,
    ],
  );
  return {
    ...result.rows[0],
    createdAt: result.rows[0].created_at,
    createdUser: result.rows[0].created_user,
  } as Template;
};

export const updateTemplate = async (
  id: string,
  updates: Partial<Omit<Template, keyof BaseEntity>> & { userId: string },
): Promise<Template> => {
  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const key of [
    'name',
    'description',
    'header_structure',
    'body_structure',
    'footer_structure',
    'css_structure',
    'js_structure',
  ] as const) {
    if (updates[key] !== undefined) {
      fields.push(`${key}=$${idx}`);
      values.push(updates[key]);
      idx++;
    }
  }

  fields.push(`updated_at=$${idx}`);
  values.push(now);
  idx++;
  fields.push(`updated_user=$${idx}`);
  values.push(updates.userId);
  idx++;

  values.push(id);

  const result = await pool.query(
    `UPDATE templates SET ${fields.join(', ')} WHERE id=$${idx} RETURNING *`,
    values,
  );
  if (!result.rowCount) throw new Error('Template not found');

  return {
    ...result.rows[0],
    updatedAt: result.rows[0].updated_at,
    updatedUser: result.rows[0].updated_user,
  } as Template;
};

export const getTemplate = async (id: string): Promise<Template | null> => {
  const result = await pool.query('SELECT * FROM templates WHERE id=$1', [id]);
  if (!result.rowCount) return null;
  return {
    ...result.rows[0],
    createdAt: result.rows[0].created_at,
    createdUser: result.rows[0].created_user,
    updatedAt: result.rows[0].updated_at,
    updatedUser: result.rows[0].updated_user,
  } as Template;
};

export const getAllTemplates = async (): Promise<Template[]> => {
  const result = await pool.query('SELECT * FROM templates');
  return result.rows.map((r: any) => ({
    ...r,
    createdAt: r.created_at,
    createdUser: r.created_user,
    updatedAt: r.updated_at,
    updatedUser: r.updated_user,
  })) as Template[];
};

export const deleteTemplate = async (id: string): Promise<void> => {
  await pool.query('DELETE FROM templates WHERE id=$1', [id]);
};
