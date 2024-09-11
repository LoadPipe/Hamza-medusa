import {
    Box,
    Flex,
    Radio,
    Text,
    Button,
    Link,
    Divider,
} from '@chakra-ui/react';
import { LineItem, Region } from '@medusajs/medusa';
import { Heading, Table } from '@medusajs/ui';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { IconContext } from 'react-icons';

import Item from '@modules/cart/components/item';
import SkeletonLineItem from '@modules/skeletons/components/skeleton-line-item';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type ItemsTemplateProps = {
    items?: Omit<ExtendedLineItem, 'beforeInsert'>[];
    region?: Region;
    currencyCode?: string;
};

const ItemsTemplate = ({ items, region, currencyCode }: ItemsTemplateProps) => {
    return (
        <Flex
            flexDir={'column'}
            maxW={'830px'}
            width={'100%'}
            height={'auto'}
            alignSelf={'self-start'}
            py={{ base: '16px', md: '40px' }}
            px={{ base: '16px', md: '45px' }}
            borderRadius={'16px'}
            backgroundColor={'#121212'}
            color={'white'}
        >
            <Flex justifyContent={{ base: 'center', md: 'left' }}>
                {/* <Radio mr="2rem" display={{ base: 'none', md: 'flex' }} /> */}
                <Text
                    fontWeight={600}
                    fontSize={{ base: '16px', md: '18px' }}
                    color="primary.green.900"
                >
                    Product Details
                </Text>
            </Flex>
            <Box
                mt="1rem"
                maxHeight={{ base: '170px', md: '400px' }}
                overflow={'hidden'}
                overflowY={'scroll'}
            >
                {items && items.length > 0 && region ? (
                    items
                        .sort((a, b) => {
                            return a.created_at > b.created_at ? -1 : 1;
                        })
                        .map((item) => {
                            return (
                                <Item
                                    key={item.id}
                                    item={item}
                                    region={region}
                                    currencyCode={currencyCode}
                                />
                            );
                        })
                ) : (
                    <Flex width={'100%'} flexDir={'column'}>
                        <Divider borderColor="#3E3E3E" borderWidth={'1px'} />
                        <Flex
                            mt={{ base: '0', md: '1.5rem' }}
                            maxW={'329px'}
                            height={{ base: '170px', md: '273px' }}
                            width={'100%'}
                            mx="auto"
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
                                    Looks like you haven't added anything to
                                    your cart yet.
                                </Text>
                            </Flex>
                            <Link
                                href={'/shop'}
                                textAlign={'center'}
                                width={'100%'}
                            >
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
                )}
            </Box>
        </Flex>
    );
};

export default ItemsTemplate;
