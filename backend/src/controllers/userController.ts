import { Request, Response } from 'express';
import { getAllUsers } from '../services/userService';

/**
 * Handles GET /api/users
 * Returns all users as a flat array.
 */
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
      message: 'Failed to fetch users',
    });
  }
};
