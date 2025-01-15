import { LineItem, Region } from '@medusajs/medusa';
import { Table, Text } from '@medusajs/ui';

import LineItemOptions from '@modules/common/components/line-item-options';
import LineItemPrice from '@modules/common/components/line-item-price';
import LineItemUnitPrice from '@modules/common/components/line-item-unit-price';
import Thumbnail from '@modules/products/components/thumbnail';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type ItemProps = {
    item: Omit<ExtendedLineItem, 'beforeInsert'>;
    region: Region;
    currencyCode: string;
};

const Item = ({ item, region, currencyCode }: ItemProps) => {
    return (
        <Table.Row className="w-full">
            <Table.Cell className="!pl-0 p-4 w-24">
                <div className="flex w-16">
                    <Thumbnail thumbnail={item.thumbnail} size="square" />
                </div>
            </Table.Cell>

            <Table.Cell className="text-left">
                <Text className="txt-medium-plus text-ui-fg-base">
                    {item.title}
                </Text>
                <LineItemOptions variant={item.variant} />
            </Table.Cell>

            <Table.Cell className="!pr-0">
                <span className="!pr-0 flex flex-col items-end h-full justify-center">
                    <span className="flex gap-x-1 ">
                        <Text className="text-ui-fg-muted">
                            {item.quantity}x{' '}
                        </Text>
                        <LineItemUnitPrice
                            item={item}
                            style="tight"
                            currencyCode={currencyCode}
                        />
                    </span>

                    <LineItemPrice item={item} />
                </span>
            </Table.Cell>
        </Table.Row>
    );
};

export default Item;
