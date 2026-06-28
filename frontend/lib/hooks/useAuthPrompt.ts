// Hook for opening the auth invitation modal from guest-only actions.

export function useAuthPrompt() {
  return { openAuthPrompt: () => undefined };
}
