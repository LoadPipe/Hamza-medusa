import { Box, Flex, Text, Button, Link, Divider } from '@chakra-ui/react';
import { HiOutlineShoppingCart } from 'react-icons/hi';

const EmptyCart = () => {
    return (
        <Flex
            width={'100%'}
            flexDir={'column'}
            justifyContent={'center'}
            alignItems={'center'}
        >
            <Divider borderColor="#3E3E3E" borderWidth={'1px'} />
            <Flex
                mt={{ base: '0', md: '3.5rem' }}
                maxW={'329px'}
                height={{ base: '170px', md: '273px' }}
                width={'100%'}
                flexDir={'column'}
                gap={{ base: 3, md: 30 }}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Flex
                    flexDir={'column'}
                    mt={{ base: '0', md: '-1rem' }}
                    gap={{ base: 0, md: '8px' }}
                >
                    <Flex
                        fontSize={{ base: '26px', md: '56px' }}
                        alignSelf={'center'}
                        mb="0.25rem"
                    >
                        <HiOutlineShoppingCart />
                    </Flex>
                    <Text
                        textAlign={'center'}
                        fontSize={{ base: '14px', md: '20px' }}
                        fontWeight={600}
                        color="primary.green.900"
                    >
                        Your cart is empty
                    </Text>
                    <Text
                        fontSize={{ base: '14px', md: '16px' }}
                        textAlign={'center'}
                    >
                        Looks like you haven't added anything to your cart yet.
                    </Text>
                </Flex>
                <Link href={'/shop'} textAlign={'center'} width={'100%'}>
                    <Button
                        backgroundColor={'primary.green.900'}
                        color="black"
                        width={{ base: '100%', md: '174px' }}
                        borderRadius={'30px'}
                        height={{ base: '42px', md: '52px' }}
                        fontSize={{ base: '14px', md: '16px' }}
                    >
                        Start Shopping
                    </Button>
                </Link>
            </Flex>
        </Flex>
    );
};

export default EmptyCart;
