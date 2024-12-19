import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import postRoutes from './post.routes';
import commentRoutes from './comment.routes';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

// Admin dashboard route
router.get('/admin/dashboard', requireAdmin, (_: Request, res: Response) => {
  res.json({
    message: 'Admin dashboard access granted',
    endpoints: {
      posts: {
        create: 'POST /api/posts',
        list: 'GET /api/posts',
        update: 'PUT /api/posts/:id',
        delete: 'DELETE /api/posts/:id'
      },
      comments: {
        list: 'GET /api/comments/all',
        update: 'PUT /api/comments/:id',
        delete: 'DELETE /api/comments/:id'
      }
    }
  });
});

// Debug route to check mounted routes
router.get('/routes', (_: Request, res: Response) => {
  res.json({
    message: 'Available routes',
    routes: {
      auth: '/api/auth/*',
      posts: '/api/posts/*',
      comments: '/api/comments/*',
      admin: '/api/admin/*'
    }
  });
});

// Health check endpoint
router.get('/health', (_: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export default router;
