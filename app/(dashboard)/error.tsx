'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="p-4 md:p-6">
      <div className="mb-8 space-y-4 max-w-2xl mx-auto text-center">
        <div className="flex justify-center">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
        </div>
        <h1 className="font-semibold text-xl md:text-2xl">
          There was a problem loading the feedback dashboard
        </h1>
        <p className="text-gray-500">
          We encountered an error while trying to fetch your feedback data. This
          might be due to a network issue or a problem with the API.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm font-medium mb-2 text-left">Error details:</p>
          <p className="text-sm text-gray-600 text-left">{error.message}</p>
        </div>
        <div className="pt-4">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          If the problem persists, try switching to a different environment or
          contact the support team.
        </p>
      </div>
    </main>
  );
}
