import { Page, BaseEntity } from '../../shared/types';
import DB from '../../shared/db';

const TABLE_NAME = 'pages'; // اسم جدول در Postgres

export const createPage = async (
  page: Omit<Page, 'id' | keyof BaseEntity> & { authorId: string },
): Promise<Page> => {
  const now = new Date().toISOString();
  const query = `
    INSERT INTO ${TABLE_NAME} 
      (title, description, author_id, parent_page_id, template_id, html_structure, css_structure, js_structure, created_at, created_user)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *;
  `;
  const values = [
    page.title,
    page.description,
    page.authorId,
    page.parentPageId || null,
    page.templateId || null,
    page.html_structure,
    page.css_structure || null,
    page.js_structure || null,
    now,
    page.authorId,
  ];
  const result = await DB.getPostgresPool().query(query, values);
  return result.rows[0] as Page;
};

export const updatePage = async (
  id: string,
  updates: Partial<Omit<Page, keyof BaseEntity>> & { authorId: string },
): Promise<Page> => {
  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (key !== 'authorId') {
      fields.push(`${snakeCase(key)}=$${idx++}`);
      values.push(value);
    }
  }

  fields.push(`updated_at=$${idx++}`);
  values.push(now);
  fields.push(`updated_user=$${idx++}`);
  values.push(updates.authorId);

  const query = `
    UPDATE ${TABLE_NAME} SET ${fields.join(', ')}
    WHERE id=$${idx} RETURNING *;
  `;
  values.push(id);

  const result = await DB.getPostgresPool().query(query, values);
  if (!result.rows[0]) throw new Error('Page not found');
  return result.rows[0] as Page;
};

function snakeCase(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
