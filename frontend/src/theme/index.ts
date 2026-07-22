import { createSystem, defaultConfig } from '@chakra-ui/react';

/**
 * Custom Chakra UI system configuration.
 * Extends the default config with project-specific tokens.
 * Add color tokens, component variants, and typography here as needed.
 */
export const system = createSystem(defaultConfig, {
  globalCss: {
    body: {
      bg: 'gray.50',
      color: 'gray.900',
    },
  },
});
