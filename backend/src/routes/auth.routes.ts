import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middleware/validation';
import { registerValidation, loginValidation } from '../validators/auth.validators';

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerValidation), register);

// POST /api/auth/login
router.post('/login', validate(loginValidation), login);

// GET /api/auth/forgot-password
router.get('/forgot-password', (_, res) => {
  res.status(200).json({
    message: 'This feature is only available in the commercial version. Please contact support for more information.'
  });
});

export default router;
