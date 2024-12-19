import { body } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { ValidationMessages } from '../middleware/validation';

const prisma = new PrismaClient();

export const registerValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage(ValidationMessages.firstName.required)
    .isLength({ min: 2 }).withMessage(ValidationMessages.firstName.length),

  body('lastName')
    .trim()
    .notEmpty().withMessage(ValidationMessages.lastName.required)
    .isLength({ min: 2 }).withMessage(ValidationMessages.lastName.length),

  body('email')
    .trim()
    .notEmpty().withMessage(ValidationMessages.email.required)
    .isEmail().withMessage(ValidationMessages.email.invalid)
    .custom(async (value) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: value }
      });
      if (existingUser) {
        throw new Error(ValidationMessages.email.exists);
      }
      return true;
    }),

  body('password')
    .trim()
    .notEmpty().withMessage(ValidationMessages.password.required)
    .isLength({ min: 8 }).withMessage(ValidationMessages.password.length)
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/).withMessage(ValidationMessages.password.format),

  body('confirmPassword')
    .trim()
    .notEmpty().withMessage(ValidationMessages.confirmPassword.required)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(ValidationMessages.confirmPassword.match);
      }
      return true;
    })
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage(ValidationMessages.email.required)
    .isEmail().withMessage(ValidationMessages.email.invalid),

  body('password')
    .trim()
    .notEmpty().withMessage(ValidationMessages.password.required)
];
