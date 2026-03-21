import { Suspense } from 'react';
import { OAuthSuccessBody } from './oauth-body';

export default function OAuthSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
          <p>Loading...</p>
        </div>
      }
    >
      <OAuthSuccessBody />
    </Suspense>
  );
}
