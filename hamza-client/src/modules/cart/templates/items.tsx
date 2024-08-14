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
};

const ItemsTemplate = ({ items, region }: ItemsTemplateProps) => {
    return (
        <Flex
            flexDir={'column'}
            maxW={'830px'}
            width={'100%'}
            height={'540px'}
            py={'40px'}
            px={'45px'}
            borderRadius={'16px'}
            backgroundColor={'#121212'}
        >
            <Flex>
                <Radio mr="2rem" />
                <Text
                    fontWeight={600}
                    fontSize={'18px'}
                    color="primary.green.900"
                >
                    Product Details
                </Text>
            </Flex>
            <Box height="400px" overflowY="scroll">
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

export default ItemsTemplate;

// <Box width="705px">
// <Table className="p-8">
//     <Table.Header className="w-full text-white">
//         <Table.Row className="txt-medium-plus bg-black">
//             <Table.HeaderCell className="!pl-0">
//                 Item
//             </Table.HeaderCell>
//             <Table.HeaderCell></Table.HeaderCell>
//             <Table.HeaderCell>Quantity</Table.HeaderCell>
//             <Table.HeaderCell className="hidden small:table-cell">
//                 Price
//             </Table.HeaderCell>
//             <Table.HeaderCell className="!pr-0 text-right">
//                 Total
//             </Table.HeaderCell>
//         </Table.Row>
//     </Table.Header>
//     <Table.Body>
//         {items && region
//             ? items
//                   .sort((a, b) => {
//                       return a.created_at > b.created_at ? -1 : 1;
//                   })
//                   .map((item) => {
//                       return (
//                           <Item
//                               key={item.id}
//                               item={item}
//                               region={region}
//                           />
//                       );
//                   })
//             : Array.from(Array(5).keys()).map((i) => {
//                   return <SkeletonLineItem key={i} />;
//               })}
//     </Table.Body>
// </Table>
// </Box>
