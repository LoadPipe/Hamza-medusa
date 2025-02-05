'use client';

import { LineItem, Region } from '@medusajs/medusa';
import { clx } from '@medusajs/ui';
import LineItemOptions from '@/modules/common/components/line-item/line-item-options';
import LineItemPrice from '@/modules/common/components/line-item/line-item-price';
import LineItemUnitPrice from '@/modules/common/components/line-item/line-item-unit-price';
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

const ItemCheckout = ({ item, region, currencyCode }: ItemProps) => {
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
            mt="1rem"
            height={{ base: '102px', md: '210px' }}
            width={'100%'}
            flexDirection={'column'}
        >
            <Divider borderColor="#3E3E3E" />

            <Flex my="auto">
                {/* <Radio mr="2rem" /> */}

                <LocalizedClientLink
                    href={`/products/${handle}`}
                    className={clx('flex', {})}
                >
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

                <Flex ml="1rem">
                    <Flex flexDirection={'column'}>
                        <Text
                            color={'white'}
                            fontSize={{ base: '14px', md: '18px' }}
                            noOfLines={{ base: 1, md: 2 }}
                            fontWeight={600}
                        >
                            {item.title}
                        </Text>
                        <Flex mt="auto">
                            <LineItemOptions variant={item.variant} />
                        </Flex>
                        <Flex mt="auto">
                            <Flex>
                                <Text
                                    alignSelf={{
                                        base: 'center',
                                        md: 'normal',
                                    }}
                                    color={'#555555'}
                                    fontSize={{ base: '14px', md: '18px' }}
                                    mr="5px"
                                >
                                    {item.quantity}x
                                </Text>
                                <LineItemUnitPrice item={item} style="tight" />
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <Flex>
                <LineItemPrice item={item} />
            </Flex>
        </Flex>
    );
};

export default ItemCheckout;
