import {
    Box,
    Text,
    HStack,
    Image as ChakraImage,
    useDisclosure,
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import Item from '@modules/cart/components/item';
import { CartWithCheckoutStep } from '@/types/global';
import { useEffect, useState } from 'react';
import { LineItem } from '@medusajs/medusa';
import { deleteLineItem } from '../actions';
import RegionLockedModal from '@/modules/cart/components/region-locked-modal';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type StoreItemsProps = {
    store: {
        id: string;
        name: string;
        icon: string;
        items: any[];
    };
    cart: CartWithCheckoutStep;
    currencyCode?: string;
};

const StoreItems = ({ store, cart }: StoreItemsProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [regionLockedItems, setRegionLockedItems] = useState<
        ExtendedLineItem[]
    >([]);

    useEffect(() => {
        if (cart?.shipping_address) {
            if (cart?.items) {
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
                    }

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
    }, [cart]);

    const handleRemoveLockedItems = () => {
        // Delete all region locked items
        regionLockedItems.forEach((item) => {
            deleteLineItem(item.id)
                .then(() => {
                    console.log(`Item ${item.id} removed`);
                })
                .catch((error: any) => {
                    console.error(`Failed to remove item ${item.id}:`, error);
                });
        });
        // Close modal after removing
        onClose();
    };

    return (
        <>
            <Box key={store.id} my={12} pt={6} borderTop="1px solid #3E3E3E">
                <Box>
                    <HStack>
                        <ChakraImage
                            src={store.icon}
                            alt="Light Logo"
                            boxSize={{ base: '32px' }}
                            borderRadius="full"
                        />
                        <Text fontWeight={600} color="white">
                            {store.name}
                        </Text>
                        <FaCheckCircle color="#3196DF" />
                    </HStack>
                </Box>
                <Box>
                    {store.items.map((item) => (
                        <Item key={item.id} item={item} />
                    ))}
                </Box>
                {cart.discounts?.some(
                    (discount) => discount.store_id === store.id
                ) && (
                    <Box>
                        <Box
                            px={3}
                            py={2}
                            backgroundColor="#242424"
                            display={'inline-block'}
                            borderRadius={'10px'}
                            color="white"
                        >
                            Discount applied:{' '}
                            {cart.discounts
                                .filter(
                                    (discount) => discount.store_id === store.id
                                )
                                .map((discount) => discount.code)
                                .join(',')}
                        </Box>
                    </Box>
                )}
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

export default StoreItems;
