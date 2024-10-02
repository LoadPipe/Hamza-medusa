import React from 'react';
import { Box } from '@chakra-ui/react';

type ProductDescriptionProps = {
    description: string; // Expecting a string with HTML content
};

const ProductDescription: React.FC<ProductDescriptionProps> = React.memo(
    ({ description }) => {
        return (
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
        );
    }
);
ProductDescription.displayName = 'ProductDescription';

export default ProductDescription;
