'use client';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  confirmUpload,
  presignUpload,
  putFileToPresignedUrl,
} from '@/lib/api/files';
import { useAppSelector } from '@/lib/store/hooks';

type Phase = 'idle' | 'presigning' | 'uploading' | 'confirming' | 'done';

export default function FilesUploadPage() {
  const router = useRouter();
  const { user, isAuthReady, accessToken } = useAppSelector((s) => s.auth);
  const [phase, setPhase] = useState<Phase>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!accessToken || !user) {
      router.replace('/login');
    }
  }, [isAuthReady, accessToken, user, router]);

  const onFile = useCallback(
    async (file: File) => {
      setError(null);
      setMessage(null);

      const rawName = file.name.trim() || 'upload.bin';
      const contentType = file.type || 'application/octet-stream';

      try {
        setPhase('presigning');
        const { url, key } = await presignUpload({
          filename: rawName,
          contentType,
        });

        setPhase('uploading');
        await putFileToPresignedUrl(url, file, contentType);

        setPhase('confirming');
        const record = await confirmUpload(key);

        setPhase('done');
        setMessage(
          `Uploaded “${record.filename}” (${record.size ?? '?'} bytes, id ${record.id}).`,
        );
      } catch (e) {
        setPhase('idle');
        if (axios.isAxiosError(e) && e.response?.status === 401) {
          setError('Session expired. Please sign in again.');
        } else if (axios.isAxiosError(e) && e.response?.data) {
          const d = e.response.data as { message?: string | string[] };
          const m = d.message;
          setError(
            Array.isArray(m) ? m.join(' ') : (m ?? 'Request failed.'),
          );
        } else {
          setError(e instanceof Error ? e.message : 'Upload failed.');
        }
      }
    },
    [],
  );

  if (!isAuthReady) {
    return (
      <div className="min-h-screen pt-28 px-4 pb-12 text-gray-400">Loading…</div>
    );
  }

  if (!accessToken || !user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-28 px-4 pb-12">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Upload file</h1>
        <p className="text-sm text-gray-400 mb-6">
          Presigned URL → direct upload to storage → confirm. You must be signed
          in.
        </p>

        <label className="block">
          <span className="sr-only">Choose file</span>
          <input
            type="file"
            disabled={phase !== 'idle' && phase !== 'done'}
            className="block w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-white hover:file:bg-white/20"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (f) void onFile(f);
            }}
          />
        </label>

        {phase !== 'idle' && phase !== 'done' ? (
          <p className="mt-4 text-sm text-gray-400" aria-live="polite">
            {phase === 'presigning' && 'Preparing upload…'}
            {phase === 'uploading' && 'Uploading to storage…'}
            {phase === 'confirming' && 'Confirming with API…'}
          </p>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-950/40 p-4 text-sm text-red-200">
            {error}
            <p className="mt-2 text-xs text-gray-400">
              Cross-origin PUT to MinIO/S3 requires CORS on the bucket. For local
              Docker, configure MinIO CORS for your web origin.
            </p>
          </div>
        ) : null}

        {message ? (
          <div className="mt-4 rounded-lg border border-green-500/30 bg-green-950/30 p-4 text-sm text-green-200">
            {message}
          </div>
        ) : null}

        <p className="mt-8 text-sm">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Home
          </Link>
        </p>
      </div>
    </div>
  );
}
