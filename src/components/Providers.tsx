'use client';

import { ToastProvider } from './Toast';
import { ConfirmProvider } from './ConfirmDialog';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        {children}
      </ConfirmProvider>
    </ToastProvider>
  );
}
