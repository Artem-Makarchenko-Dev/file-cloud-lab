export type PresignResponse = {
  url: string;
  key: string;
};

export type FileRecord = {
  id: number;
  key: string;
  filename: string;
  contentType: string;
  size: number | null;
  status: string;
  uploadedBy: number;
  createdAt: string;
};
