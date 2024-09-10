'use client';

import { Order } from '@medusajs/medusa';
import { TABS } from 'modules/order-tab-management';
import { Button, ButtonGroup, Box } from '@chakra-ui/react';
import All from '@modules/order/templates/all';
import Processing from '@modules/order/templates/processing';
import Shipped from '@modules/order/templates/shipped';
import Delivered from '@modules/order/templates/delivered';
import Cancelled from '@modules/order/templates/cancelled';
import Refund from '@modules/order/templates/refund';
import { useOrderTabStore } from '@store/order-tab-state';

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

const OrderOverview = ({ orders }: { orders: Order[] }) => {
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
                return <Processing orders={orders} isEmpty={true} />;
            case TABS.SHIPPED:
                return <Shipped orders={orders} isEmpty={true} />;
            case TABS.DELIVERED:
                return <Delivered orders={orders} isEmpty={true} />;
            case TABS.CANCELLED:
                return <Cancelled orders={orders} isEmpty={true} />;
            case TABS.REFUND:
                return <Refund orders={orders} isEmpty={true} />;
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
