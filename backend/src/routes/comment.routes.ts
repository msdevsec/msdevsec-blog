import { Router } from 'express';
import { createComment, getAllComments, updateComment, deleteComment } from '../controllers/comment.controller';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createCommentValidation, updateCommentValidation } from '../validators/comment.validators';

const router = Router();

// Regular user route - only create comments
router.post('/', requireAuth, validate(createCommentValidation), createComment);

// Admin only routes - full control over comments
router.get('/all', requireAdmin, getAllComments);
router.put('/:id', requireAdmin, validate(updateCommentValidation), updateComment);
router.delete('/:id', requireAdmin, deleteComment);

// Note: Regular users can only create comments on published posts
// Comment editing and deletion is restricted to admin users only
// This is enforced in the controllers as well

export default router;
