'use client';

import { useState } from 'react';
import { Order } from '@medusajs/medusa';
import { TABS } from 'modules/order-tab-management';

import { orderDetails, cancelOrder } from '@lib/data';
import { Button, ButtonGroup, Box } from '@chakra-ui/react';
import All from '@modules/order/templates/all';
import Processing from '@modules/order/templates/processing';
import Shipped from '@modules/order/templates/shipped';
import Delivered from '@modules/order/templates/delivered';
import Cancelled from '@modules/order/templates/cancelled';
import Refund from '@modules/order/templates/refund';
import { useOrderTabStore } from '@store/order-tab-state';
// Define a type that extends the Order type with any additional data
interface DetailedOrder extends Order {
    details?: any; // Further specify if you have the structure of the details
}
type OrderDetails = {
    thumbnail: string;
    title: string;
    description: string;
};
type OrderProps = {
    id: string;
    display_id: string;
    created_at: string;
    details: OrderDetails;
    paid_total: number;
    currency_code: string;
    unit_price: number;
    thumbnail: string;
    title: string;
    description: string;
    region: {
        id: string;
        name: string;
    };
};

const commonButtonStyles = {
    borderRadius: '8px',
    width: '146px',
    height: '56px',
    padding: '16px',
    bg: 'gray.900',
    borderColor: 'transparent',
    color: 'white',
    _hover: {
        // Assuming you want hover effects as well
        bg: 'gray.200',
        color: 'black',
    },
    _active: {
        bg: 'primary.green.900',
        color: 'black',
        transform: 'scale(0.98)',
        borderColor: '#bec3c9',
    },
};

enum OrderBucketType {
    TO_PAY = 1,
    TO_SHIP = 2,
    SHIPPED = 3,
    COMPLETED = 4,
    CANCELLED = 5,
    REFUNDED = 6,
}
const OrderOverview = ({ orders }: { orders: Order[] }) => {
    // Initialize state with the correct type

    const orderActiveTab = useOrderTabStore((state) => state.orderActiveTab);

    const setOrderActiveTab = useOrderTabStore(
        (state) => state.setOrderActiveTab
    );

    const handleTabChange = (tab: string) => {
        if (orderActiveTab !== tab) {
            setOrderActiveTab(tab);
        }
    };

    const renderTabContent = () => {
        switch (orderActiveTab) {
            case TABS.PROCESSING:
                return <Processing orders={orders} />;
            case TABS.SHIPPED:
                return <Shipped orders={orders} />;
            case TABS.DELIVERED:
                return <Delivered orders={orders} />;
            case TABS.CANCELLED:
                return <Cancelled orders={orders} />;
            case TABS.REFUND:
                return <Refund orders={orders} />;
            default:
                return <All orders={orders} />;
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap="4"
            width="full"
            color="white"
            p="8"
        >
            <ButtonGroup isAttached justifyContent="center">
                {Object.values(TABS).map((tab) => (
                    <Button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        {...commonButtonStyles}
                        isActive={orderActiveTab === tab}
                    >
                        {tab}
                    </Button>
                ))}
            </ButtonGroup>
            {renderTabContent()}
        </Box>
    );
};

export default OrderOverview;
