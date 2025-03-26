'use client';

import React, { useEffect, useMemo } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import DOMPurify from 'dompurify';

// Function to check if a string contains HTML tags
const isHTML = (str: string): boolean => {
    try {
        const doc = new DOMParser().parseFromString(str, 'text/html');
        return Array.from(doc.body.childNodes).some(
            (node) => node.nodeType === 1
        );
    } catch (e) {
        return false;
    }
};

type ProductDescriptionProps = {
    subtitle: string;
    description: string;
};

const ProductDescription: React.FC<ProductDescriptionProps> = React.memo(
    ({ subtitle, description }) => {
        // Compute the sanitized description using useMemo
        const [sanitizedDescription, setSanitizedDescription] =
            React.useState(description);

        useEffect(() => {
            if (isHTML(description)) {
                setSanitizedDescription(
                    DOMPurify.sanitize(description, {
                        ADD_TAGS: ['iframe'],
                    })
                );
            } else {
                setSanitizedDescription(description);
            }
        }, [description]);

        return (
            <>
                <Flex flexDirection={'column'}>
                    <Heading
                        as="h2"
                        fontSize={{ base: '16px', md: '24px' }}
                        color="primary.green.900"
                    >
                        Product Info
                    </Heading>
                    <Text fontSize={{ base: '14px', md: '16px' }} color="white">
                        {subtitle}
                    </Text>
                </Flex>
                <Flex flexDirection={'column'}>
                    <Heading
                        as="h2"
                        fontSize={{ base: '16px', md: '24px' }}
                        color="primary.green.900"
                    >
                        About this item
                    </Heading>
                    <Box fontSize={{ base: '14px', md: '16px' }} color="white">
                        <div
                            dangerouslySetInnerHTML={{
                                __html:
                                    sanitizedDescription ||
                                    'No description available.',
                            }}
                            style={{ maxWidth: '100%', overflow: 'hidden' }}
                        />
                    </Box>
                </Flex>
            </>
        );
    }
);
ProductDescription.displayName = 'ProductDescription';

export default ProductDescription;
