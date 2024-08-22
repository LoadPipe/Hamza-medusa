import { Box, Flex, Radio, Text, Button, Link } from '@chakra-ui/react';
import { LineItem, Region } from '@medusajs/medusa';
import { Heading, Table } from '@medusajs/ui';

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
    console.log('this is items', items);
    console.log('this is region', region);
    console.log('this is items type', typeof items);
    console.log('this is region type', typeof region);

    if (items === undefined) {
        console.log('items is undefined');
    } else if (items === null) {
        console.log('items is null');
    }

    if (region === undefined) {
        console.log('regiom is undefined');
    } else if (region === null) {
        console.log('regiom is null');
    }

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
                    fontSize={'18px'}
                    color="primary.green.900"
                >
                    Product Details
                </Text>
            </Flex>
            <Box
                mt="1rem"
                height={{ base: '170px', md: '400px' }}
                overflowY="scroll"
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
                    <Flex
                        maxW={'329px'}
                        width={'100%'}
                        mx="auto"
                        flexDir={'column'}
                        gap={30}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Flex flexDir={'column'}>
                            <Text
                                textAlign={'center'}
                                fontSize={'20px'}
                                fontWeight={600}
                                color="primary.green.900"
                            >
                                Your cart is empty
                            </Text>
                            <Text textAlign={'center'}>
                                Looks like you haven't added anything to your
                                cart yet.
                            </Text>
                        </Flex>
                        <Link href={'/store'}>
                            <Button
                                backgroundColor={'primary.green.900'}
                                color="black"
                                borderRadius={'30px'}
                            >
                                Start Shopping
                            </Button>
                        </Link>
                    </Flex>
                )}
            </Box>
        </Flex>
    );
};

export default ItemsTemplate;

// Array.from(Array(5).keys()).map((i) => {
//     return <SkeletonLineItem key={i} />;
// })
