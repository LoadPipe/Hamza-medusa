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
import Spinner from '@modules/common/icons/spinner';
import { useState } from 'react';
import ErrorMessage from '@modules/checkout/components/error-message';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { Flex, Text, Divider } from '@chakra-ui/react';
import { Radio, RadioGroup } from '@chakra-ui/react';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type ItemProps = {
    item: Omit<ExtendedLineItem, 'beforeInsert'>;
    region: Region;
    type?: 'full' | 'preview';
    currencyCode?: string;
};

const Item = ({ item, region, currencyCode }: ItemProps) => {
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
                        <Thumbnail thumbnail={item.thumbnail} size="square" />
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
                                <LineItemUnitPrice
                                    item={item}
                                    region={region}
                                    style="tight"
                                    currencyCode={currencyCode}
                                />
                            </Flex>

                            <LineItemPrice
                                item={item}
                                region={region}
                                style="tight"
                                currencyCode={currencyCode}
                            />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Item;

/*
'use client';

import { LineItem, Region } from '@medusajs/medusa';
import { Table, Text, clx } from '@medusajs/ui';

import CartItemSelect from '@modules/cart/components/cart-item-select';
import DeleteButton from '@modules/common/components/delete-button';
import LineItemOptions from '@modules/common/components/line-item-options';
import LineItemPrice from '@modules/common/components/line-item-price';
import LineItemUnitPrice from '@modules/common/components/line-item-unit-price';
import Thumbnail from '@modules/products/components/thumbnail';
import { updateLineItem } from '@modules/cart/actions';
import Spinner from '@modules/common/icons/spinner';
import { useState } from 'react';
import ErrorMessage from '@modules/checkout/components/error-message';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type ItemProps = {
    item: Omit<ExtendedLineItem, 'beforeInsert'>;
    region: Region;
    type?: 'full' | 'preview';
};

const Item = ({ item, region, type = 'full' }: ItemProps) => {
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
        <Table.Row className="w-full bg-black">
            <Table.Cell className="!pl-0 p-4 w-24">
                <LocalizedClientLink
                    href={`/products/${handle}`}
                    className={clx('flex', {
                        'w-16': type === 'preview',
                        'small:w-24 w-12': type === 'full',
                    })}
                >
                    <Thumbnail thumbnail={item.thumbnail} size="square" />
                </LocalizedClientLink>
            </Table.Cell>

            <Table.Cell className="text-left">
                <Text className="txt-medium-plus text-ui-fg-muted">
                    {item.title}
                </Text>
                <LineItemOptions variant={item.variant} />
            </Table.Cell>

            {type === 'full' && (
                <Table.Cell>
                    <div className="flex gap-2 items-center w-28">
                        <DeleteButton id={item.id} />
                        <CartItemSelect
                            value={item.quantity}
                            onChange={(value) =>
                                changeQuantity(parseInt(value.target.value))
                            }
                            className="w-14 h-10 p-4"
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
                        {updating && <Spinner />}
                    </div>
                    <ErrorMessage error={error} />
                </Table.Cell>
            )}

            {type === 'full' && (
                <Table.Cell className="hidden small:table-cell">
                    <LineItemUnitPrice
                        item={item}
                        region={region}
                        style="tight"
                                        currencyCode={currencyCode}
                    />
                </Table.Cell>
            )}

            <Table.Cell className="!pr-0">
                <span
                    className={clx('!pr-0', {
                        'flex flex-col items-end h-full justify-center':
                            type === 'preview',
                    })}
                >
                    {type === 'preview' && (
                        <span className="flex gap-x-1 ">
                            <Text className="text-ui-fg-muted">
                                {item.quantity}x{' '}
                            </Text>
                            <LineItemUnitPrice
                                item={item}
                                region={region}
                                style="tight"
                                        currencyCode={currencyCode}
                            />
                        </span>
                    )}
                    <LineItemPrice item={item} region={region} style="tight" 
                                currencyCode={currencyCode}/>
                </span>
            </Table.Cell>
        </Table.Row>
    );
};

export default Item;



*/
