import { Router } from 'express';
import { 
  createPost, 
  getPosts, 
  getPost, 
  updatePost, 
  deletePost,
  togglePostVisibility 
} from '../controllers/post.controller';
import { requireAdmin, requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createPostValidation, updatePostValidation } from '../validators/post.validators';

const router = Router();

// Public routes - but with role-based filtering
router.get('/', getPosts); // Will show only published posts to non-admins
router.get('/:identifier', getPost); // Will show only published posts to non-admins

// Admin only routes - protected with requireAdmin middleware
router.post('/', requireAdmin, validate(createPostValidation), createPost);
router.put('/:id', requireAdmin, validate(updatePostValidation), updatePost);
router.delete('/:id', requireAdmin, deletePost);

// New endpoint for toggling post visibility (hide/show)
router.patch('/:id/toggle-visibility', requireAdmin, togglePostVisibility);

export default router;
