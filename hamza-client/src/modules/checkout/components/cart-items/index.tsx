import { Box, Flex, Radio, Text, useDisclosure } from '@chakra-ui/react';
import { Cart, LineItem, Region } from '@medusajs/medusa';
import { Heading, Table } from '@medusajs/ui';

import Item from '@modules/cart/components/item-checkout';
import SkeletonLineItem from '@modules/skeletons/components/skeleton-line-item';
import RegionLockedModal from './components/region-locked-modal';
import { useEffect, useState } from 'react';
import { deleteLineItem } from '@modules/cart/actions';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type ItemsTemplateProps = {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
    items?: Omit<ExtendedLineItem, 'beforeInsert'>[];
    region?: Region;
    currencyCode: string;
};

const CartItems = ({
    items,
    region,
    currencyCode,
    cart,
}: ItemsTemplateProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [regionLockedItems, setRegionLockedItems] = useState<
        ExtendedLineItem[]
    >([]);

    useEffect(() => {
        if (cart?.shipping_address) {
            if (items && region) {
                const lockedItems = items.filter((item) => {
                    return item.id !== region.id;
                });
                // Find items that are region-locked
                setRegionLockedItems(lockedItems as ExtendedLineItem[]);

                // If there are region-locked items, show the modal
                if (lockedItems.length > 0) {
                    onOpen();
                }
            }
        }
    }, [items, region, onOpen, cart]);

    const handleRemoveLockedItems = () => {
        // Log the region-locked items
        console.log('Removing region-locked items:', regionLockedItems);

        // Delete all region locked items
        regionLockedItems.forEach((item) => {
            deleteLineItem(item.id)
                .then(() => {
                    console.log(`Item ${item.id} removed`);
                })
                .catch((error) => {
                    console.error(`Failed to remove item ${item.id}:`, error);
                });
        });
        // Close modal after removing
        onClose();
    };

    return (
        <>
            <Box mt="1rem" height={'auto'}>
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
            <RegionLockedModal
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={handleRemoveLockedItems}
                lockedItems={regionLockedItems}
            />
        </>
    );
};

export default CartItems;
