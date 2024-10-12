'use client';

import { LineItem, Region } from '@medusajs/medusa';
import CartItemSelect from '@modules/cart/components/cart-item-select';
import DeleteButton from '@modules/common/components/delete-button';
import LineItemOptions from '@modules/common/components/line-item-options';
import LineItemPrice from '@modules/common/components/line-item-price';
import Thumbnail from '@modules/products/components/thumbnail';
import { updateLineItem, deleteLineItem } from '@modules/cart/actions';
import { useCallback, useEffect, useState } from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { Flex, Text, Divider } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type ItemProps = {
    item: Omit<ExtendedLineItem, 'beforeInsert'>;
    region: Region;
    type?: 'full' | 'preview';
    currencyCode?: string;
};

const debouncedChangeQuantity = debounce(
    async (quantity: number, updateLineItemFn: Function) => {
        await updateLineItemFn(quantity);
        console.log('Server update triggered');
    },
    5000
);

const Item = ({ item, region }: ItemProps) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { handle } = item.variant.product;

    useEffect(() => {
        console.log('RUNNING');
        if (item.variant.inventory_quantity === 0) {
            console.log('WTF');

            // Item is no longer available
            toast.error(`Item not available at this time`);
            deleteLineItem(item.id); // Trigger delete
        } else if (
            item.quantity > item.variant.inventory_quantity &&
            item.variant.inventory_quantity > 0
        ) {
            // Only reset the quantity if it's larger than available stock
            // and the API hasn't already reset it
            if (item.quantity !== 1) {
                console.log('WTF');
                toast.error(`Quantity Selected is unavailable, resetting`);
                updateLineItem({ lineId: item.id, quantity: 1 });
            }
        }
    }, [item.variant.inventory_quantity, item.quantity]); // Track quantity and stock

    const handleUpdateLineItem = async (qty: number) => {
        setUpdating(true);
        const message = await updateLineItem({
            lineId: item.id,
            quantity: qty,
        })
            .catch((err) => {
                setError(err.message);
                setQuantity(item.quantity); // Reset to original quantity if error
            })
            .finally(() => {
                setUpdating(false);
            });

        if (message) {
            setError(message);
        }
    };

    const changeQuantity = (newQuantity: number) => {
        if (newQuantity !== quantity) {
            setQuantity(newQuantity);
            debouncedChangeQuantity(newQuantity, handleUpdateLineItem);
        }
    };

    useEffect(() => {
        console.log('changeQuantity called');
    }, [changeQuantity]);

    return (
        <Flex
            height={{ base: '102px', md: '210px' }}
            width={'100%'}
            flexDirection={'column'}
        >
            <Divider borderColor="#3E3E3E" />

            <Flex my="auto">
                {/* <Radio mr="2rem" /> */}

                <LocalizedClientLink href={`/products/${handle}`}>
                    <Flex
                        alignSelf={'center'}
                        width={{ base: '60px', md: '110px' }}
                        height={{ base: '60px', md: '110px' }}
                    >
                        <Thumbnail
                            thumbnail={
                                item?.variant?.metadata?.imgUrl ??
                                item?.thumbnail
                            }
                            size="square"
                        />
                    </Flex>
                </LocalizedClientLink>

                <Flex width={'100%'} ml="1rem">
                    <Flex
                        pr="1rem"
                        ml={{ base: '0', md: '1rem' }}
                        flexDirection={'column'}
                    >
                        <Text
                            color={'white'}
                            fontSize={{ base: '14px', md: '18px' }}
                            noOfLines={{ base: 1, md: 2 }}
                            fontWeight={600}
                            mb="auto"
                        >
                            {item.title}
                        </Text>
                        <LineItemOptions variant={item.variant} />
                        <Flex mt="auto">
                            <LineItemPrice item={item} />
                        </Flex>
                    </Flex>

                    <Flex ml="auto" flexDirection={'column'}>
                        <Flex ml="auto" mb={{ base: 'auto', md: '1.25rem' }}>
                            <DeleteButton id={item.id} />
                        </Flex>
                        <CartItemSelect
                            value={quantity} // Visual update
                            onChange={(valueAsNumber) =>
                                changeQuantity(Number(valueAsNumber))
                            } // Debounced server update
                            min={1}
                            max={Math.min(
                                item.variant.inventory_quantity > 0
                                    ? item.variant.inventory_quantity
                                    : 100,
                                100
                            )}
                            className="w-12 h-8 md:w-14 md:h-10 mt-auto"
                        />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Item;
