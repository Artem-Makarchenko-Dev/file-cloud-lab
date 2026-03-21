'use client';

import axios from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchUserById } from '@/lib/api/users';
import { canReadUsers } from '@/lib/permissions';
import { useAppSelector } from '@/lib/store/hooks';
import type { AuthUser } from '@/lib/store/auth.types';
import type { UserDetail } from '@/lib/types/users';

function parseRouteUserId(
  idParam: string | string[] | undefined,
): number {
  if (typeof idParam === 'string') {
    return Number.parseInt(idParam, 10);
  }
  if (Array.isArray(idParam)) {
    return Number.parseInt(idParam[0] ?? '', 10);
  }
  return Number.NaN;
}

type LoadErrorKind = 'forbidden' | 'not_found' | 'generic';

function classifyLoadError(error: unknown): LoadErrorKind {
  if (!axios.isAxiosError(error)) {
    return 'generic';
  }
  const status = error.response?.status;
  if (status === 403) {
    return 'forbidden';
  }
  if (status === 404) {
    return 'not_found';
  }
  return 'generic';
}

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen pt-28 px-4 pb-12 text-gray-400">Loading…</div>
  );
}

function AccessDeniedView() {
  return (
    <div className="min-h-screen pt-28 px-4 pb-12">
      <div className="max-w-xl mx-auto rounded-lg border border-red-500/30 bg-red-950/40 p-6 text-center">
        <h1 className="text-xl font-semibold text-red-200">Access denied</h1>
        <p className="mt-2 text-sm text-gray-400">
          You need the <code className="text-purple-300">users.read</code>{' '}
          permission.
        </p>
        <Link
          href="/users"
          className="mt-4 inline-block text-sm text-blue-400 hover:text-blue-300"
        >
          Back to users
        </Link>
      </div>
    </div>
  );
}

function NotFoundView() {
  return (
    <div className="min-h-screen pt-28 px-4 pb-12 text-center">
      <p className="text-gray-400">User not found.</p>
      <Link
        href="/users"
        className="mt-4 inline-block text-sm text-blue-400 hover:text-blue-300"
      >
        Back to users
      </Link>
    </div>
  );
}

function ErrorRetryView({
  message,
  onRetry,
}: Readonly<{ message: string; onRetry: () => void }>) {
  return (
    <div className="min-h-screen pt-28 px-4 pb-12 text-center">
      <p className="text-red-300">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 text-sm text-blue-400 hover:text-blue-300"
      >
        Retry
      </button>
    </div>
  );
}

function UserDetailCard({ detail }: Readonly<{ detail: UserDetail }>) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6 space-y-4">
      <h1 className="text-2xl font-bold text-white">{detail.email}</h1>
      <dl className="grid gap-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">ID</dt>
          <dd className="text-gray-200">{detail.id}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Role</dt>
          <dd className="text-gray-200">{detail.role.name}</dd>
        </div>
        {detail.role.description ? (
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Role description</dt>
            <dd className="text-gray-200 text-right">{detail.role.description}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Active</dt>
          <dd
            className={detail.isActive ? 'text-green-400' : 'text-gray-500'}
          >
            {detail.isActive ? 'Yes' : 'No'}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Created</dt>
          <dd className="text-gray-300">
            {new Date(detail.createdAt).toLocaleString()}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Updated</dt>
          <dd className="text-gray-300">
            {new Date(detail.updatedAt).toLocaleString()}
          </dd>
        </div>
      </dl>
    </div>
  );
}

async function runUserDetailLoad(
  id: number,
  user: AuthUser | null,
  setters: {
    setDetail: (v: UserDetail) => void;
    setForbidden: (v: boolean) => void;
    setNotFound: (v: boolean) => void;
    setError: (v: string | null) => void;
    setLoading: (v: boolean) => void;
  },
): Promise<void> {
  const { setDetail, setForbidden, setNotFound, setError, setLoading } = setters;

  if (!Number.isFinite(id) || id < 1) {
    setError('Invalid user id.');
    setLoading(false);
    return;
  }
  if (!canReadUsers(user)) {
    setForbidden(true);
    setLoading(false);
    return;
  }

  setError(null);
  setForbidden(false);
  setNotFound(false);
  setLoading(true);

  try {
    const data = await fetchUserById(id);
    setDetail(data);
  } catch (e) {
    switch (classifyLoadError(e)) {
      case 'forbidden':
        setForbidden(true);
        break;
      case 'not_found':
        setNotFound(true);
        break;
      default:
        setError('Failed to load user.');
    }
  } finally {
    setLoading(false);
  }
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = useMemo(() => parseRouteUserId(params.id), [params.id]);

  const { user, isAuthReady, accessToken } = useAppSelector((s) => s.auth);
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    await runUserDetailLoad(id, user, {
      setDetail,
      setForbidden,
      setNotFound,
      setError,
      setLoading,
    });
  }, [id, user]);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }
    if (!accessToken || !user) {
      router.replace('/login');
      return;
    }
    void load();
  }, [isAuthReady, accessToken, user, router, load]);

  if (!isAuthReady) {
    return <AuthLoadingScreen />;
  }

  if (forbidden) {
    return <AccessDeniedView />;
  }

  if (notFound) {
    return <NotFoundView />;
  }

  if (error) {
    return (
      <ErrorRetryView message={error} onRetry={() => void load()} />
    );
  }

  return (
    <div className="min-h-screen pt-28 px-4 pb-12">
      <div className="max-w-xl mx-auto">
        <Link
          href="/users"
          className="text-sm text-blue-400 hover:text-blue-300 mb-6 inline-block"
        >
          ← Users
        </Link>

        {loading && !detail ? (
          <p className="text-gray-400">Loading…</p>
        ) : null}
        {detail ? <UserDetailCard detail={detail} /> : null}
      </div>
    </div>
  );
}
