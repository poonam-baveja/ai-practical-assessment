import { createToaster } from '@chakra-ui/react';

/**
 * App-wide toaster instance.
 * Use `toaster.create()` to show toast notifications.
 */
export const toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true,
  overlap: false,
  gap: 16,
  offsets: '24px',
});
