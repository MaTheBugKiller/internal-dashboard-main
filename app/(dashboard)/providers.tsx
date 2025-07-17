'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { EnvironmentProvider } from './env-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <EnvironmentProvider>
        {children}
      </EnvironmentProvider>
    </TooltipProvider>
  );
}