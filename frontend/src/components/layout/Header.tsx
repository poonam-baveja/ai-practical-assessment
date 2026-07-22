import { Box, Flex, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

/**
 * Application header — sticky, consistent with page container width.
 * Accessible: uses <header> landmark and <nav> would go here if more links added.
 */
export function Header() {
  return (
    <Box
      as="header"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      position="sticky"
      top={0}
      zIndex={10}
      boxShadow="sm"
    >
      <Flex
        maxW="5xl"
        mx="auto"
        px={{ base: 4, md: 8 }}
        py={4}
        align="center"
        justify="space-between"
      >
        <Link to="/tickets" aria-label="Go to ticket list">
          <Heading as="h1" size="md" color="blue.600" _hover={{ color: 'blue.700' }}>
            Support Tickets
          </Heading>
        </Link>
      </Flex>
    </Box>
  );
}
