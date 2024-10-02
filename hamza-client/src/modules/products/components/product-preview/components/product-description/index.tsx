import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';

type ProductDescriptionProps = {
    subtitle: string;
    description: string;
};

const ProductDescription: React.FC<ProductDescriptionProps> = React.memo(
    ({ subtitle, description }) => {
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
                            dangerouslySetInnerHTML={{ __html: description }}
                            style={{ maxWidth: '100%', overflow: 'hidden' }}
                        />
                        <style jsx>{`
                            iframe {
                                width: 100%;
                                height: auto;
                                max-width: 100%;
                            }
                            .container {
                                position: relative;
                                width: 100%;
                                padding-bottom: 56.25%;
                                height: 0;
                                overflow: hidden;
                            }

                            .container iframe {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                            }
                        `}</style>
                    </Box>
                </Flex>
            </>
        );
    }
);
ProductDescription.displayName = 'ProductDescription';

export default ProductDescription;
