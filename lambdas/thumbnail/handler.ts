import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';
import sharp from 'sharp';

interface S3EventRecord {
  s3: {
    bucket: { name: string };
    object: { key: string };
  };
}

interface S3Event {
  Records: S3EventRecord[];
}

const THUMBNAIL_PREFIX = 'thumbnails/';
const SOURCE_PREFIX = 'users/';
const THUMBNAIL_SIZE = 200;
const JPEG_QUALITY = 80;

function log(
  level: 'info' | 'warn' | 'error',
  message: string,
  meta: Record<string, unknown> = {},
): void {
  console.log(
    JSON.stringify({
      level,
      message,
      ...meta,
      timestamp: new Date().toISOString(),
    }),
  );
}

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

function decodeObjectKey(key: string): string {
  return decodeURIComponent(key.replace(/\+/g, ' '));
}

function toThumbnailKey(sourceKey: string): string {
  if (!sourceKey.startsWith(SOURCE_PREFIX)) {
    throw new Error(`Expected key to start with ${SOURCE_PREFIX}`);
  }
  return sourceKey.replace(SOURCE_PREFIX, THUMBNAIL_PREFIX);
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function processRecord(
  client: S3Client,
  bucket: string,
  record: S3EventRecord,
): Promise<void> {
  const objectKey = decodeObjectKey(record.s3.object.key);

  if (objectKey.startsWith(THUMBNAIL_PREFIX)) {
    log('info', 'Skipping thumbnail object', { objectKey });
    return;
  }

  if (!objectKey.startsWith(SOURCE_PREFIX)) {
    log('warn', 'Skipping object outside users prefix', { objectKey });
    return;
  }

  const thumbnailKey = toThumbnailKey(objectKey);

  log('info', 'Generating thumbnail', { objectKey, thumbnailKey });

  const getResponse = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: objectKey }),
  );

  if (!getResponse.Body || !(getResponse.Body instanceof Readable)) {
    throw new Error(`S3 object body is not a readable stream: ${objectKey}`);
  }

  const originalBuffer = await streamToBuffer(getResponse.Body);
  const thumbnailBuffer = await sharp(originalBuffer)
    .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, { fit: 'cover' })
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: thumbnailKey,
      Body: thumbnailBuffer,
      ContentType: 'image/jpeg',
    }),
  );

  log('info', 'Thumbnail saved', {
    objectKey,
    thumbnailKey,
    sizeBytes: thumbnailBuffer.length,
  });
}

export const handler = async (event: S3Event): Promise<void> => {
  const region = getEnv('S3_REGION');
  const bucket = getEnv('S3_BUCKET');
  const client = new S3Client({ region });

  log('info', 'Thumbnail lambda invoked', {
    recordCount: event.Records.length,
    bucket,
    region,
  });

  for (const record of event.Records) {
    try {
      await processRecord(client, bucket, record);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log('error', 'Failed to process S3 record', {
        objectKey: decodeObjectKey(record.s3.object.key),
        error: message,
      });
      throw error;
    }
  }
};
