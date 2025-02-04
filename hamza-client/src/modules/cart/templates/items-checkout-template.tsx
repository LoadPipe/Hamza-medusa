import { Box, Flex, Radio, Text } from '@chakra-ui/react';
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
    currencyCode: string;
    cart_id: string;
};

const ItemsCheckoutTemplate = ({
    items,
    region,
    currencyCode,
    cart_id,
}: ItemsTemplateProps) => {
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
        >
            <Flex justifyContent={{ base: 'center', md: 'left' }}>
                {/* <Radio mr="2rem" display={{ base: 'none', md: 'flex' }} /> */}
                <Text
                    fontWeight={600}
                    fontSize={'18px'}
                    color="primary.green.900"
                >
                    Order Summary
                </Text>
            </Flex>
            <Box
                mt="1rem"
                height={{ base: '170px', md: '400px' }}
                overflowY="scroll"
            >
                {items && region
                    ? items
                          .sort((a, b) => {
                              return a.created_at > b.created_at ? -1 : 1;
                          })
                          .map((item) => {
                              return (
                                  <Item
                                      key={item.id}
                                      cart_id={cart_id}
                                      item={item}
                                      region={region}
                                      currencyCode={currencyCode}
                                  />
                              );
                          })
                    : Array.from(Array(5).keys()).map((i) => {
                          return <SkeletonLineItem key={i} />;
                      })}
            </Box>
        </Flex>
    );
};

export default ItemsCheckoutTemplate;
