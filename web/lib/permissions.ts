import type { AuthUser } from '@/lib/store/auth.types';

export function canReadUsers(user: AuthUser | null): boolean {
  return Boolean(user?.permissions?.includes('users.read'));
}

export function canDeleteUsers(user: AuthUser | null): boolean {
  return Boolean(user?.permissions?.includes('users.delete'));
}
