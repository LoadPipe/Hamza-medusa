import { Table } from '@medusajs/ui';
import Divider from '@modules/common/components/divider';
import Thumbnail from '@modules/products/components/thumbnail';
import React, { useState } from 'react';
import { Button } from '@medusajs/ui';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import itemStore, { Item } from '@store/review/review-store';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type ItemsProps = {
    currency_code: string;
    id: string;
    created_at: string;
    updated_at: string;
    cart_id: string;
    order_id: string | null;
    swap_id: string | null;
    claim_order_id: string | null;
    original_item_id: string | null;
    order_edit_id: string | null;
    title: string;
    description: string;
    thumbnail: string;
    is_return: boolean;
    is_giftcard: boolean;
    should_merge: boolean;
    allow_discounts: boolean;
    has_shipping: boolean;
    unit_price: number;
    variant_id: string;
    quantity: number;
    fulfilled_quantity: number | null;
    returned_quantity: number | null;
    shipped_quantity: number | null;
    metadata: Record<string, unknown>;
    customer_id: string;
};
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    thumbnail: string;
    title: string;
}
interface Items {
    [key: string]: CartItem[];
}

interface Props {
    items: Items;
    handles: any;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

const Items: React.FC<Props> = ({ items, handles }) => {
    const setItem = itemStore((state) => state.setItem);
    const router = useRouter();

    const handleItemClick = async (item: any) => {
        // console.log(`Checking review existence for order: ${item?.order_id}`);
        try {
            const response = await axios.post(
                `${BACKEND_URL}/custom/review/exists`,
                {
                    order_id: item?.order_id,
                }
            );
            const reviewExists = response.data; // Assuming response directly returns true/false
            // console.log(`response data ${reviewExists}`);
            if (!reviewExists) {
                // console.log('User has already reviewed');
                router.push(`/account/editreview/${item.id}`);
            } else {
                // console.log('User has not reviewed yet');
                router.push(`/account/reviews/${item.id}`);
            }
        } catch (error: any) {
            alert('Failed to check review existence: ' + error.message);
        }
        setItem(item);
    };

    return (
        <div className="flex flex-col">
            <Divider className="!mb-0" />
            <Table className="m-4">
                <Table.Body>
                    {Object.entries(items).map(([id, cartItems], cartIndex) =>
                        cartItems.map((item: any, itemIndex) => (
                            <Table.Row key={item.id}>
                                <Button
                                    className="m-2"
                                    onClick={() => handleItemClick(item)}
                                >
                                    Review
                                </Button>

                                <Table.Cell>
                                    <div className="flex items-center">
                                        <p className="text-sm font-semibold">
                                            Item ID: {item.id}
                                        </p>
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex items-center">
                                        <p className="text-sm font-semibold">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <LocalizedClientLink
                                        href={`/products/${handles.order[itemIndex]}`} // Use handles array to index handle
                                    >
                                        <Thumbnail
                                            thumbnail={item.thumbnail}
                                            images={[]}
                                            size="small"
                                        />
                                        {item.title}
                                    </LocalizedClientLink>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table>
        </div>
    );
};

export default Items;
