import { Providers } from './app/providers';
import { AppRoutes } from './app/routes';

/**
 * Root application component.
 * Wraps routes in all providers (Chakra, React Query, Router).
 */
function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}

export default App;
