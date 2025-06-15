import { writable } from 'svelte/store';

type FileUploadStore = {
  open: () => Promise<File | null>;
  _trigger: (() => void) | null;
  _resolver: ((value: File | null) => void) | null;
};

function createFileUploadDialog() {
  const { subscribe, update } = writable<FileUploadStore>({
    open: () => Promise.resolve(null),
    _trigger: null,
    _resolver: null,
  });

  return {
    subscribe,
    setTrigger(triggerFn: () => void) {
      update((state) => ({ ...state, _trigger: triggerFn }));
    },
    async open(): Promise<File | null> {
      return new Promise<File | null>((resolve) => {
        update((state) => ({ ...state, _resolver: resolve }));
        const { _trigger } = get(fileUploadDialog);
        _trigger?.();
      });
    },
    resolve(file: File | null) {
      update((state) => {
        state._resolver?.(file);
        return { ...state, _resolver: null };
      });
    },
  };
}

import { get } from 'svelte/store';
export const fileUploadDialog = createFileUploadDialog();
