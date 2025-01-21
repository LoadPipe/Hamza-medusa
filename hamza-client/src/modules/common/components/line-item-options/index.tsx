import { ProductVariant } from '@medusajs/medusa';
// import { Text } from "@medusajs/ui"
import { Text } from '@chakra-ui/react';

type LineItemOptionsProps = { variant: ProductVariant };

const LineItemOptions = ({ variant }: LineItemOptionsProps) => {
    return (
        <Text fontSize={{ base: '10px', md: '14px' }} color={'#C2C2C2'}>
            Variant: {variant.title}
        </Text>
    );
};

export default LineItemOptions;
