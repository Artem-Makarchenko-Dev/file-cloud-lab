'use client';

import axios from 'axios';
import { useState } from 'react';
import { deleteUserById } from '@/lib/api/users';

type Props = Readonly<{
  targetUserId: number;
  targetEmail: string;
  currentUserId: number;
  canDelete: boolean;
  onDeleted: () => void;
}>;

export function UserDeleteSection({
  targetUserId,
  targetEmail,
  currentUserId,
  canDelete,
  onDeleted,
}: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canDelete) {
    return null;
  }

  if (targetUserId === currentUserId) {
    return (
      <p className="mt-4 text-sm text-amber-400/90">
        You cannot delete your own account from here.
      </p>
    );
  }

  const handleConfirm = async () => {
    setError(null);
    setBusy(true);
    try {
      await deleteUserById(targetUserId);
      setOpen(false);
      onDeleted();
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 403) {
        setError('You do not have permission to delete users.');
      } else {
        setError('Failed to delete user. Try again.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-6 border-t border-white/10 pt-6">
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className="rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-950/50 transition-colors"
      >
        Delete user
      </button>

      {open ? (
        <dialog
          open
          className="fixed inset-0 z-50 flex max-h-none max-w-none items-center justify-center border-0 bg-black/70 p-4 backdrop:bg-black/70"
          aria-labelledby="delete-user-title"
        >
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-gray-950 p-6 shadow-xl">
            <h2
              id="delete-user-title"
              className="text-lg font-semibold text-white"
            >
              Delete user?
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              This will permanently remove{' '}
              <span className="text-gray-200">{targetEmail}</span>. This action
              cannot be undone.
            </p>
            {error ? (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            ) : null}
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleConfirm()}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
              >
                {busy ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </dialog>
      ) : null}
    </div>
  );
}
