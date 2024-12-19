import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { RegisterInput, LoginInput, JwtPayload } from '../types';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role }: RegisterInput & { role?: string } = req.body;

    // Prevent admin registration through API
    if (role === 'ADMIN') {
      return res.status(403).json({ 
        message: 'Registering admin accounts is not permitted through the API. Please contact MSDEVSEC support for assistance.' 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user (always as regular user)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'USER', // Force regular user role
        isPremium: false
      }
    });

    // Generate JWT token
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role
    };
    const token = generateToken(payload);

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user;
    return res.status(201).json({
      message: 'Registration successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginInput = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role
    };
    const token = generateToken(payload);

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
};
