import api from '@/lib/api/axios';
import type { FileRecord, PresignResponse } from '@/lib/types/files';

export async function presignUpload(payload: {
  filename: string;
  contentType: string;
}): Promise<PresignResponse> {
  const { data } = await api.post<PresignResponse>('/files/presign', payload);
  return data;
}

export async function confirmUpload(key: string): Promise<FileRecord> {
  const { data } = await api.post<FileRecord>('/files/confirm', { key });
  return data;
}

export async function putFileToPresignedUrl(
  uploadUrl: string,
  file: Blob,
  contentType: string,
): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': contentType,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Storage upload failed (${res.status} ${res.statusText})${text ? `: ${text.slice(0, 200)}` : ''}`,
    );
  }
}
