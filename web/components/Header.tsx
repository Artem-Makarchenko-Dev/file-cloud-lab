'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { canReadUsers } from '@/lib/permissions';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logoutThunk } from '@/lib/store/auth.thunks';

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLoggedIn = Boolean(accessToken && user);
  const showUsersNav = isLoggedIn && canReadUsers(user);

  const onLogout = async () => {
    await dispatch(logoutThunk());
    router.push('/login');
  };

  return (
    <header
      className={`flex items-center justify-between p-6 fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-950/80 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="flex items-center">
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          File Cloud Lab
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            {showUsersNav ? (
              <Link
                href="/users"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Users
              </Link>
            ) : null}
            <Link
              href="/files"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Files
            </Link>
            <span className="text-sm text-gray-300">{user?.email}</span>
            <button
              type="button"
              onClick={() => void onLogout()}
              className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
