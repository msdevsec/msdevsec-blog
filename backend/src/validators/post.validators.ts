import { body } from 'express-validator';
import { ValidationMessages } from '../middleware/validation';

export const createPostValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage(ValidationMessages.title.required)
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),

  body('content')
    .trim()
    .notEmpty().withMessage(ValidationMessages.content.required)
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters long'),

  body('category')
    .trim()
    .notEmpty().withMessage(ValidationMessages.category.required)
    .isIn(['CODE_TUTORIAL', 'PENTESTING']).withMessage(ValidationMessages.category.invalid),

  body('published')
    .optional()
    .isBoolean().withMessage('Published must be a boolean value'),

  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Excerpt must not exceed 200 characters')
];

export const updatePostValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),

  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters long'),

  body('category')
    .optional()
    .trim()
    .isIn(['CODE_TUTORIAL', 'PENTESTING']).withMessage(ValidationMessages.category.invalid),

  body('published')
    .optional()
    .isBoolean().withMessage('Published must be a boolean value'),

  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Excerpt must not exceed 200 characters')
];
