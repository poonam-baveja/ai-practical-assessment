import api from '../../../services/api';
import type { User } from '../types';

/**
 * Fetches all users from the backend.
 * GET /api/users → returns User[]
 */
export async function getUsers(): Promise<User[]> {
  const response = await api.get<User[]>('/api/users');
  return response.data;
}
