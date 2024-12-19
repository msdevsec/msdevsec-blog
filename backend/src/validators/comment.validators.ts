import { body } from 'express-validator';
import { ValidationMessages } from '../middleware/validation';

export const createCommentValidation = [
  body('content')
    .trim()
    .notEmpty().withMessage(ValidationMessages.content.required)
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),

  body('postId')
    .trim()
    .notEmpty().withMessage('Post ID is required')
];

export const updateCommentValidation = [
  body('content')
    .trim()
    .notEmpty().withMessage(ValidationMessages.content.required)
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters')
];
