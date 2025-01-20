import { ProductVariant } from '@medusajs/medusa';
// import { Text } from "@medusajs/ui"
import { Text } from '@chakra-ui/react';

type LineItemOptionsProps = { variant: ProductVariant };

const LineItemOptions = ({ variant }: LineItemOptionsProps) => {
    return (
        <Text
            fontSize={{ base: '10px', md: '16px' }}
            color={'white'}
            opacity={'0.4'}
        >
            Variant: {variant.title}
        </Text>
    );
};

export default LineItemOptions;
