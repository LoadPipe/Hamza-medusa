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
};

const CartItems = ({ items, region, currencyCode }: ItemsTemplateProps) => {
    return (
        <>
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
        </>
    );
};

export default CartItems;
