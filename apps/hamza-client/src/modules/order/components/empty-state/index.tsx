import { Box, Button, Text } from '@chakra-ui/react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

const EmptyState = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="full"
            bg="rgba(39, 39, 39, 0.3)"
            color="white"
            p={8}
        >
            <Text fontSize="xl" fontWeight="bold">
                Nothing to see here
            </Text>
            <Text>You don't have any orders yet, let us change that :)</Text>
            <LocalizedClientLink href="/" passHref>
                <Button m={8} colorScheme="whiteAlpha">
                    Continue shopping
                </Button>
            </LocalizedClientLink>
        </Box>
    );
};

export default EmptyState;
