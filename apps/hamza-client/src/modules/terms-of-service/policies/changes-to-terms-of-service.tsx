import { Flex, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import React from 'react';

const ChangesToTermsOfService = () => {
    return (
        <Flex
            flexDirection="column"
            fontSize={{ base: '14px', md: '16px' }}
            lineHeight={{ base: '1.6', md: '1.8' }}
            p={{ base: 4, md: 6 }}
            textAlign="left"
        >
            {/* Header */}
            <Text
                fontWeight="bold"
                fontSize={{ base: '18px', md: '20px' }}
                mb={4}
            >
                Changes to the Terms of Service
            </Text>
            <Text mb={4}>
                Our platform reserves the right to update or modify these Terms
                of Service (ToS) at any time. It’s important for users to stay
                informed by regularly reviewing the ToS to ensure they
                understand any changes.
            </Text>

            {/* Notice of Changes */}
            <Text fontWeight="bold" mb={4}>
                1. Notice of Changes
            </Text>
            <Text mb={4}>
                We may update the ToS from time to time, and we will do our best
                to notify users of significant changes. However, we cannot
                guarantee that all notifications will be received. It is your
                responsibility to revisit our terms regularly by checking the
                platform for updates.
            </Text>

            {/* Acceptance of Changes */}
            <Text fontWeight="bold" mb={4}>
                2. Acceptance of Changes
            </Text>
            <Text mb={4}>
                By continuing to use the platform after changes to the ToS are
                made, you agree to accept and follow the updated terms. If you
                do not agree with any of the changes, you should stop using the
                platform.
            </Text>
            <Text>
                You can review previous versions of the ToS if needed by
                contacting our customer support team or visiting the link to the
                archive of past versions on the platform.
            </Text>
        </Flex>
    );
};

export default ChangesToTermsOfService;
