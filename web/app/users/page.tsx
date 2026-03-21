'use client';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { fetchUsersPage } from '@/lib/api/users';
import { canReadUsers } from '@/lib/permissions';
import { useAppSelector } from '@/lib/store/hooks';
import type { PaginationResponse } from '@/lib/types/pagination';
import type { UserListRow } from '@/lib/types/users';

export default function UsersPage() {
  const router = useRouter();
  const { user, isAuthReady, accessToken } = useAppSelector((s) => s.auth);
  const [page, setPage] = useState(1);
  const [payload, setPayload] = useState<PaginationResponse<UserListRow> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!canReadUsers(user)) {
      setForbidden(true);
      setLoading(false);
      return;
    }
    setError(null);
    setForbidden(false);
    setLoading(true);
    try {
      const data = await fetchUsersPage(page, 10);
      setPayload(data);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 403) {
        setForbidden(true);
      } else {
        setError('Failed to load users.');
      }
    } finally {
      setLoading(false);
    }
  }, [page, user]);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!accessToken || !user) {
      router.replace('/login');
      return;
    }
    void load();
  }, [isAuthReady, accessToken, user, router, load]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen pt-28 px-4 pb-12 text-gray-400">Loading…</div>
    );
  }

  if (forbidden) {
    return (
      <div className="min-h-screen pt-28 px-4 pb-12">
        <div className="max-w-xl mx-auto rounded-lg border border-red-500/30 bg-red-950/40 p-6 text-center">
          <h1 className="text-xl font-semibold text-red-200">Access denied</h1>
          <p className="mt-2 text-sm text-gray-400">
            You need the <code className="text-purple-300">users.read</code>{' '}
            permission.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm text-blue-400 hover:text-blue-300"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-28 px-4 pb-12">
        <p className="text-center text-red-300">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 mx-auto block text-sm text-blue-400 hover:text-blue-300"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Users</h1>

        {loading && !payload ? (
          <p className="text-gray-400">Loading users…</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Active</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {payload?.data.map((row) => (
                    <tr key={row.id} className="hover:bg-white/5">
                      <td className="px-4 py-3">
                        <Link
                          href={`/users/${row.id}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {row.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-200">{row.email}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {row.role?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            row.isActive ? 'text-green-400' : 'text-gray-500'
                          }
                        >
                          {row.isActive ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(row.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {payload && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400">
                <span>
                  Page {payload.meta.page} of {Math.max(payload.meta.totalPages, 1)}{' '}
                  · {payload.meta.total} total
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!payload.meta.hasPrevPage || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-full border border-white/20 px-4 py-1.5 text-white hover:bg-white/10 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={!payload.meta.hasNextPage || loading}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-full border border-white/20 px-4 py-1.5 text-white hover:bg-white/10 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
