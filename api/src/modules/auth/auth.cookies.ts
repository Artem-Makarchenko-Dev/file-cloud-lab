import type { CookieOptions, Response } from 'express';

export const COOKIE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function isProd() {
  return process.env.NODE_ENV === 'production';
}

export function getSidCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd(),
    maxAge: COOKIE_TTL_MS,
    path: '/',
  };
}

export function getRefreshCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd(),
    maxAge: COOKIE_TTL_MS,
    path: '/',
  };
}

export function setAuthCookies(res: Response, sid: string, refreshToken: string) {
  res.cookie('sid', sid, getSidCookieOptions());
  res.cookie('refresh', refreshToken, getRefreshCookieOptions());
}

export function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie('refresh', refreshToken, getRefreshCookieOptions());
}

export function clearAuthCookies(res: Response) {
  res.clearCookie('sid', { path: '/' });
  res.clearCookie('refresh', { path: '/auth/refresh' });
}
