import { Types, Document } from "mongoose";

export interface BlogSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface BlogAuthor {
  name: string;
  avatar?: string;
}

export interface BlogCategoryRef {
  _id: Types.ObjectId;
  title?: string; // populated
  slug?: string;  // populated
}

export interface BlogDoc extends Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  category: Types.ObjectId | BlogCategoryRef;
  categoryName: string;
  isActive: boolean;
  order: number;
  readTime: string;
  views: number;
  author: BlogAuthor;
  seo?: BlogSEO;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// When using .lean()
export type BlogLean = Omit<BlogDoc, keyof Document> & {
  _id: string; // make _id string after lean()
  category: BlogCategoryRef;
};