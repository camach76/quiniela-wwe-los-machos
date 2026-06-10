export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Capture the full stack trace of any localStorage.getItem call that fails,
    // so we can identify the exact source of the error.
    const originalLS = globalThis.localStorage;
    console.log('[instrumentation] localStorage type:', typeof originalLS);
    console.log('[instrumentation] localStorage.getItem type:', typeof (originalLS as any)?.getItem);

    if (
      typeof originalLS !== 'undefined' &&
      typeof (originalLS as any).getItem !== 'function'
    ) {
      console.log('[instrumentation] Patching broken localStorage global...');
      const memStore: Record<string, string> = {};
      const patched = {
        getItem: (key: string): string | null => {
          console.trace('[localStorage.getItem] called with key:', key);
          return memStore[key] ?? null;
        },
        setItem: (key: string, value: string): void => { memStore[key] = value; },
        removeItem: (key: string): void => { delete memStore[key]; },
        clear: (): void => { Object.keys(memStore).forEach(k => delete memStore[k]); },
        get length(): number { return Object.keys(memStore).length; },
        key: (index: number): string | null => Object.keys(memStore)[index] ?? null,
      };
      try {
        (globalThis as any).localStorage = patched;
        console.log('[instrumentation] localStorage patched successfully, getItem:', typeof (globalThis as any).localStorage.getItem);
      } catch (e) {
        console.error('[instrumentation] Failed to patch localStorage:', e);
      }
    } else {
      console.log('[instrumentation] localStorage already has getItem, no patch needed');
    }
  }
}
