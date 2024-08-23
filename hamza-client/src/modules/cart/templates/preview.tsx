'use client';

import { LineItem, Region } from '@medusajs/medusa';
import { Table, clx } from '@medusajs/ui';

import Item from '@modules/cart/components/item-checkout';
import SkeletonLineItem from '@modules/skeletons/components/skeleton-line-item';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type ItemsTemplateProps = {
    items?: Omit<ExtendedLineItem, 'beforeInsert'>[];
    region?: Region;
    currencyCode?: string;
};

const ItemsPreviewTemplate = ({
    items,
    region,
    currencyCode,
}: ItemsTemplateProps) => {
    const hasOverflow = items && items.length > 4;

    return (
        <div
            className={clx({
                'pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]':
                    hasOverflow,
            })}
        >
            <Table>
                <Table.Body>
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
                </Table.Body>
            </Table>
        </div>
    );
};

export default ItemsPreviewTemplate;
