'use client';
import { useCartStore } from '@/zustand/cart-store/cart-store';
import { LineItem } from '@medusajs/medusa';
import DeleteButton from '@modules/common/components/delete-button';
import LineItemOptions from '@/modules/common/components/line-item/line-item-options';
import LineItemPrice from '@/modules/common/components/line-item/line-item-price';
import Thumbnail from '@modules/products/components/thumbnail';
import { updateLineItem, deleteLineItem } from '@modules/cart/actions';
import { useEffect, useState, useRef } from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { Flex, Text, useMediaQuery } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import LineItemUnitPrice from '@/modules/common/components/line-item/line-item-unit-price';
import ItemQuantityButton from './components/item-quantity-button';
import { useQueryClient } from '@tanstack/react-query';
type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type ItemProps = {
    item: Omit<ExtendedLineItem, 'beforeInsert'>;
};

const Item = ({ item }: ItemProps) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const setIsUpdatingCart = useCartStore((state) => state.setIsUpdatingCart);
    const [isMobile] = useMediaQuery('(max-width: 768px)');

    const { handle } = item.variant.product;
    const queryClient = useQueryClient();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const changeQuantity = async (newQuantity: number) => {
        try {
            // Update UI immediately
            setQuantity(newQuantity);

            // Debounce the server update
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(async () => {
                setIsUpdatingCart(true);
                await updateLineItem({
                    lineId: item.id,
                    quantity: newQuantity,
                });
                await queryClient.invalidateQueries({ queryKey: ['cart'] });
                setIsUpdatingCart(false);
            }, 500); // 500ms debounce
        } catch (error) {
            console.error('Error updating quantity:', error);
            setIsUpdatingCart(false);
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (item?.variant?.inventory_quantity === 0) {
            toast.error(`Item not available at this time`);
            deleteLineItem(item.id); // Trigger delete
        } else if (
            item.quantity > item.variant.inventory_quantity &&
            item.variant.inventory_quantity > 0
        ) {
            // Only reset the quantity if it's larger than available stock
            // and the API hasn't already reset it
            if (item.quantity !== 1) {
                toast.error(`Quantity Selected is unavailable, resetting`);
                updateLineItem({ lineId: item?.id, quantity: 1 });
            }
        }
    }, [item?.variant?.inventory_quantity, item?.quantity]); // Track quantity and stock

    // useEffect(() => {
    //     console.log('changeQuantity called');
    // }, [changeQuantity]);

    return (
        <Flex
            // height={{ base: '150px', md: '210px' }}
            width={'100%'}
            flexDirection={'column'}
        >
            <Flex my="6" className="cart-item-container">
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

                <Flex width="100%" ml="1rem">
                    <Flex
                        ml={{ base: '0', md: '1rem' }}
                        flexDirection="column"
                        width="100%" // Ensures full width of parent Flex
                    >
                        {/* Title and Delete Button */}
                        <Flex
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                        >
                            <LocalizedClientLink href={`/products/${handle}`}>
                                <Text
                                    color="white"
                                    fontSize={{ base: '14px', md: '18px' }}
                                    noOfLines={{ base: 1, md: 2 }}
                                    fontWeight={600}
                                    mb="auto"
                                    width="100%"
                                    cursor="pointer"
                                    _hover={{ color: '#94D42A' }}
                                    transition="color 0.2s"
                                >
                                    {item?.title}
                                </Text>
                            </LocalizedClientLink>
                            <Flex ml="auto">
                                <DeleteButton
                                    id={item?.id}
                                    className="delete-button"
                                />
                            </Flex>
                        </Flex>

                        {/* Options and Quantity Selector */}
                        <Flex
                            mt={{ base: '0', md: '1rem' }}
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                        >
                            <Flex width="100%">
                                <LineItemOptions variant={item?.variant} />
                            </Flex>
                            {!isMobile && (
                                <Flex display={{ base: 'none', md: 'flex' }}>
                                    <ItemQuantityButton
                                        value={quantity}
                                        onChange={(newQuantity) =>
                                            changeQuantity(newQuantity)
                                        }
                                        min={1}
                                        max={Math.min(
                                            item?.variant?.inventory_quantity >
                                                0
                                                ? item?.variant
                                                      ?.inventory_quantity
                                                : 100,
                                            100
                                        )}
                                    />
                                </Flex>
                            )}
                        </Flex>

                        {/* Price Section */}
                        <Flex
                            justifyContent="space-between"
                            mt="auto"
                            width="100%"
                        >
                            <Flex>
                                <LineItemUnitPrice
                                    item={item}
                                    currencyCode={item.currency_code}
                                    useChakra={true}
                                    displayReducedPrice={false}
                                    displayCurrencyLetters={false}
                                />
                            </Flex>
                            <Flex>
                                <LineItemPrice
                                    item={item}
                                    usdcOnDifferentLine={true}
                                />
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            {isMobile && (
                <Flex display={{ base: 'flex', md: 'none' }} my={'1rem'}>
                    <ItemQuantityButton
                        value={quantity}
                        onChange={(newQuantity) => changeQuantity(newQuantity)}
                        min={1}
                        max={Math.min(
                            item?.variant?.inventory_quantity > 0
                                ? item?.variant?.inventory_quantity
                                : 100,
                            100
                        )}
                    />
                </Flex>
            )}
        </Flex>
    );
};

export default Item;
