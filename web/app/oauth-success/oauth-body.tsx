'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { setAccessToken } from '@/lib/store/auth.slice';
import { meThunk } from '@/lib/store/auth.thunks';

export function OAuthSuccessBody() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const accessToken = searchParams.get('accessToken');

    if (!accessToken) {
      router.replace('/login');
      return;
    }

    void (async () => {
      try {
        dispatch(setAccessToken(accessToken));
        await dispatch(meThunk()).unwrap();
        router.replace('/');
      } catch {
        router.replace('/login');
      }
    })();
  }, [dispatch, router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
      <p>Signing you in...</p>
    </div>
  );
}
