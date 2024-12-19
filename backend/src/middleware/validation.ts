import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../types';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors: ValidationError[] = errors.array().map(err => ({
      msg: err.msg,
      param: err.param
    }));

    return res.status(400).json({
      message: 'Validation failed',
      errors: formattedErrors
    });
  };
};

// Common validation messages
export const ValidationMessages = {
  firstName: {
    required: 'First name is required',
    length: 'First name must be at least 2 characters long'
  },
  lastName: {
    required: 'Last name is required',
    length: 'Last name must be at least 2 characters long'
  },
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address',
    exists: 'This email is already registered'
  },
  password: {
    required: 'Password is required',
    length: 'Password must be at least 8 characters long',
    format: 'Password must contain at least one number and one special character'
  },
  confirmPassword: {
    required: 'Please confirm your password',
    match: 'Passwords do not match'
  },
  content: {
    required: 'Content is required',
    length: 'Content must not be empty'
  },
  title: {
    required: 'Title is required',
    length: 'Title must not be empty'
  },
  category: {
    required: 'Category is required',
    invalid: 'Invalid category selected'
  }
};
