'use client';

import { createContext, createElement, ReactNode, useContext, useMemo, useState } from 'react';
import AuthPromptModal from '@/components/ui/AuthPromptModal';

interface AuthPromptContextValue {
  openAuthPrompt: () => void;
  closeAuthPrompt: () => void;
  isOpen: boolean;
}

const AuthPromptContext = createContext<AuthPromptContextValue | undefined>(undefined);

export function AuthPromptProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      openAuthPrompt: () => setIsOpen(true),
      closeAuthPrompt: () => setIsOpen(false),
      isOpen,
    }),
    [isOpen],
  );

  return createElement(
    AuthPromptContext.Provider,
    { value },
    children,
    createElement(AuthPromptModal, { isOpen, onClose: () => setIsOpen(false) }),
  );
}

export function useAuthPrompt() {
  const context = useContext(AuthPromptContext);

  if (!context) {
    throw new Error('useAuthPrompt must be used within an AuthPromptProvider');
  }

  return context;
}
