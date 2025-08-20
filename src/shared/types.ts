// src/shared/types.ts

export interface BaseEntity {
  createdAt: string;
  updatedAt?: string;
  createdUser: string;
  updatedUser?: string;
}

export interface Template extends BaseEntity {
  id: string;
  name: string;
  description: string;
  header_structure: string;
  body_structure: string;
  footer_structure: string;
  css_structure?: string;
  js_structure?: string;
}

export interface Category extends BaseEntity {
  id: string;
  name: string;
  description: string;
  parentCategoryId?: string;
  templateId?: string;
}

export interface Post extends BaseEntity {
  id: string;
  title: string;
  content: string;
  description: string;
  authorId: string;
  publishName: string;
  templateId?: string;
  categoryId?: string;
  tagIds?: string[];
}

export interface Comment extends BaseEntity {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  approved: boolean;
}

export interface User extends BaseEntity {
  id: string;
  username: string;
  displayName: string;
  publishName: string;
  passwordHash: string;
  email?: string;
}

export interface Page extends BaseEntity {
  id: string;
  title: string;
  description: string;
  authorId: string;
  parentPageId?: string;
  templateId?: string;
  html_structure: string;
  css_structure?: string;
  js_structure?: string;
}

export interface Tag extends BaseEntity {
  id: string;
  name: string;
  description?: string;
}
