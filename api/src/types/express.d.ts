import type { AuthUser } from '../modules/auth/types/auth-user.type';

declare module 'express' {
  interface Request {
    user?: AuthUser;
    userId?: number;
  }
}
