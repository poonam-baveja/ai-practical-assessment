import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/userApi';

/**
 * Fetches all users via TanStack Query.
 * Used for populating dropdowns (assigned to, created by).
 */
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}
