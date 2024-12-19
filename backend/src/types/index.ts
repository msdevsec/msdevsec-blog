import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: User;
}

export type UserRole = 'USER' | 'ADMIN';

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export interface CreatePostInput {
  title: string;
  content: string;
  category: 'CODE_TUTORIAL' | 'PENTESTING';
  excerpt?: string;
  published?: boolean;
}

export interface CreateCommentInput {
  content: string;
  postId: string;
}

export interface ValidationError {
  msg: string;
  param: string;
}

export interface ApiError extends Error {
  statusCode?: number;
  errors?: ValidationError[];
}
