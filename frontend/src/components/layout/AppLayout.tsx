import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { PageContainer } from './PageContainer';

/**
 * Root layout component — renders on every route.
 * Composes the Header + PageContainer around the active route's page.
 * Uses React Router's <Outlet /> to render child routes.
 */
export function AppLayout() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Header />
      <PageContainer>
        <Outlet />
      </PageContainer>
    </Box>
  );
}
