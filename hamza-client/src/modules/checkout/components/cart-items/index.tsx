import { Box, useDisclosure } from '@chakra-ui/react';
import { Cart, LineItem, Region } from '@medusajs/medusa';
import SkeletonLineItem from '@modules/skeletons/components/skeleton-line-item';
import RegionLockedModal from './components/region-locked-modal';
import { useEffect, useState } from 'react';
import { deleteLineItem } from '@modules/cart/actions';
import Item from '../../../cart/components/item';

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
            if (items) {
                // Filter items with geo-restriction tags
                const variantsWithGeoRestriction: any[] = cart.items.filter(
                    (i) =>
                        (i.variant?.product?.tags ?? []).find((t: any) =>
                            t.id.startsWith('geo-restriction')
                        )
                );

                if (variantsWithGeoRestriction?.length) {
                    const restrictedVariants = [];
                    for (let item of variantsWithGeoRestriction ?? []) {
                        const tags =
                            item?.variant?.product?.tags?.filter((t: any) =>
                                t?.id?.startsWith('geo-restriction')
                            ) ?? [];
                            
                        let geoRestricted: boolean = true;
                        for (let tag of tags) {
                            if (tag?.metadata?.country) {
                                if (
                                    cart?.shipping_address?.country_code?.toLowerCase() ===
                                    tag.metadata.country.toLowerCase()
                                ) {
                                    geoRestricted = false;
                                }
                            }
                        }

                        if (geoRestricted) restrictedVariants.push(item);

                    setRegionLockedItems(
                        restrictedVariants as ExtendedLineItem[]
                    );

                    // If there are region-locked items, show the modal
                    if (restrictedVariants.length > 0) {
                        onOpen();
                    }
                }
            }
        }
    }, [items, region, onOpen, cart]);

    const handleRemoveLockedItems = () => {
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
                                      key={item?.id}
                                      item={item}
                                      region={region}
                                      currencyCode={currencyCode}
                                      cart_id={item?.cart_id}
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
