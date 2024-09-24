'use client';

import { LineItem, Region } from '@medusajs/medusa';
import { Table, clx } from '@medusajs/ui';
import CartItemSelect from '@modules/cart/components/cart-item-select';
import DeleteButton from '@modules/common/components/delete-button';
import LineItemOptions from '@modules/common/components/line-item-options';
import LineItemPrice from '@modules/common/components/line-item-price';
import LineItemUnitPrice from '@modules/common/components/line-item-unit-price';
import Thumbnail from '@modules/products/components/thumbnail';
import { updateLineItem } from '@modules/cart/actions';
import { useState } from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { Flex, Text, Divider } from '@chakra-ui/react';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type ItemProps = {
    item: Omit<ExtendedLineItem, 'beforeInsert'>;
    region: Region;
    type?: 'full' | 'preview';
    currencyCode?: string;
};

const Item = ({ item, region }: ItemProps) => {
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { handle } = item.variant.product;

    const changeQuantity = async (quantity: number) => {
        setError(null);
        setUpdating(true);

        const message = await updateLineItem({
            lineId: item.id,
            quantity,
        })
            .catch((err) => {
                return err.message;
            })
            .finally(() => {
                setUpdating(false);
            });

        message && setError(message);
    };

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
                        <Thumbnail thumbnail={item.thumbnail} size="square" />
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
                            value={item.quantity}
                            onChange={(value) =>
                                changeQuantity(parseInt(value.target.value))
                            }
                            className="w-12 h-8 md:w-14 md:h-10 mt-auto"
                        >
                            {Array.from(
                                {
                                    length: Math.min(
                                        item.variant.inventory_quantity > 0
                                            ? item.variant.inventory_quantity
                                            : 10,
                                        10
                                    ),
                                },
                                (_, i) => (
                                    <option value={i + 1} key={i}>
                                        {i + 1}
                                    </option>
                                )
                            )}
                        </CartItemSelect>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Item;
