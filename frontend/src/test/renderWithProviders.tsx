import { render, type RenderOptions } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from '../theme';

/**
 * Custom render that wraps components in ChakraProvider.
 * Use this for any component that uses Chakra UI components.
 */
function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <ChakraProvider value={system}>{children}</ChakraProvider>;
  }
  return render(ui, { wrapper: Wrapper, ...options });
}

export { renderWithProviders };
