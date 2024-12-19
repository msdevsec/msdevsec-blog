import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import slugify from 'slugify';

const prisma = new PrismaClient();

// Toggle post visibility (admin only)
export const togglePostVisibility = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const authorId = req.user?.id;

    if (!authorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        published: !post.published,
        updatedAt: new Date()
      }
    });

    return res.json({
      message: updatedPost.published ? 'Post is now visible' : 'Post is now hidden',
      post: updatedPost
    });
  } catch (error) {
    console.error('Toggle visibility error:', error);
    return res.status(500).json({ message: 'Failed to toggle post visibility' });
  }
};

// Create new post (admin only)
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category, published = false } = req.body;
    const authorId = req.user?.id;

    if (!authorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        published,
        slug,
        authorId
      }
    });

    return res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({ message: 'Failed to create post' });
  }
};

// Get all posts (filtered based on user role)
export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === 'ADMIN';
    const { category } = req.query;
    
    const posts = await prisma.post.findMany({
      where: {
        // If not admin, only show published posts
        ...(isAdmin ? {} : { published: true }),
        ...(category && { category: category as string })
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json({
      posts,
      message: isAdmin ? 'All posts (including hidden)' : 'Visible posts only'
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// Get single post (admin can see unpublished, others only published)
export const getPost = async (req: AuthRequest, res: Response) => {
  try {
    const { identifier } = req.params;
    const isAdmin = req.user?.role === 'ADMIN';

    const post = await prisma.post.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ],
        // If not admin, only show published posts
        ...(isAdmin ? {} : { published: true })
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    return res.status(500).json({ message: 'Failed to fetch post' });
  }
};

// Update post (admin only)
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, category, published } = req.body;
    const authorId = req.user?.id;

    if (!authorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if post exists and belongs to the user
    const existingPost = await prisma.post.findFirst({
      where: {
        id,
        authorId
      }
    });

    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(title && { slug: slugify(title, { lower: true, strict: true }) }),
        ...(content && { content }),
        ...(category && { category }),
        ...(published !== undefined && { published }),
        updatedAt: new Date()
      }
    });

    return res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    return res.status(500).json({ message: 'Failed to update post' });
  }
};

// Delete post (admin only)
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const authorId = req.user?.id;

    if (!authorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if post exists and belongs to the user
    const existingPost = await prisma.post.findFirst({
      where: {
        id,
        authorId
      }
    });

    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    await prisma.post.delete({
      where: { id }
    });

    return res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json({ message: 'Failed to delete post' });
  }
};
