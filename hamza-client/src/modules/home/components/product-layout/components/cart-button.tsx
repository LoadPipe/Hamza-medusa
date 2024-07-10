import { Button, Text, Flex, Box } from '@chakra-ui/react';
import { BiPlus } from 'react-icons/bi';

type CartButtonProps = {
    styles: string;
    handleBuyNow: () => void;
    loader: boolean;
    outOfStock: boolean;
    title: string;
};

const CartButton: React.FC<CartButtonProps> = ({
    styles,
    handleBuyNow,
    loader,
    outOfStock,
    title,
}) => {
    return (
        <Button
            color="#7B61FF"
            borderColor="#7B61FF"
            className={styles}
            variant="outline"
            onClick={handleBuyNow}
            isLoading={loader}
            disabled={outOfStock}
        >
            <Flex>
                <Box alignSelf={'center'}>
                    <BiPlus color="#7B61FF" size={18} />
                </Box>
                <Text alignSelf={'center'} fontSize={'15px'}>
                    {title}
                </Text>
            </Flex>
        </Button>
    );
};

export default CartButton;
