import React from 'react'; // Required for React.memo
import { Box } from '@chakra-ui/react'; // Required for Box from Chakra UI

type ProductDescriptionProps = {
    description: string; // Expecting a string with HTML content
};

const ProductDescription: React.FC<ProductDescriptionProps> = React.memo(
    ({ description }) => {
        return (
            <Box fontSize={{ base: '14px', md: '16px' }} color="white">
                {/* Render dynamic HTML with responsive video scaling */}
                <div
                    dangerouslySetInnerHTML={{ __html: description }}
                    style={{ maxWidth: '100%', overflow: 'hidden' }} // Optional: max-width to prevent overflow
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
