import { Box, Flex, Text } from '@chakra-ui/react';
import { Toaster, ToastRoot, ToastCloseTrigger } from '@chakra-ui/react';
import { toaster } from '../utils/toaster';

/**
 * Renders the Toaster with a custom toast layout.
 * Wider, shorter toast with horizontal layout.
 */
export function ToasterComponent() {
  return (
    <Toaster toaster={toaster}>
      {(toast) => (
        <ToastRoot key={toast.id} width="380px" py={3} px={4}>
          <Flex align="center" justify="space-between" width="100%">
            <Box>
              {toast.title && (
                <Text fontWeight="semibold" fontSize="sm">
                  {toast.title}
                </Text>
              )}
              {toast.description && (
                <Text fontSize="xs" opacity={0.9}>
                  {toast.description}
                </Text>
              )}
            </Box>
            <ToastCloseTrigger position="static" />
          </Flex>
        </ToastRoot>
      )}
    </Toaster>
  );
}
