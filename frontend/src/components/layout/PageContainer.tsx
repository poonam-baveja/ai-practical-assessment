import { Box } from '@chakra-ui/react';

interface PageContainerProps {
  children: React.ReactNode;
}

/**
 * Wraps page content with consistent max-width, centered alignment, and padding.
 */
export function PageContainer({ children }: PageContainerProps) {
  return (
    <Box
      as="main"
      maxW="5xl"
      mx="auto"
      px={{ base: 4, md: 8 }}
      py={8}
    >
      {children}
    </Box>
  );
}
