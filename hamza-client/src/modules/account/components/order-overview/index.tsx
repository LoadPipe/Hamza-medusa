'use client';
import { TABS } from '@/modules/order-tab-management';
import {
    ButtonGroup,
    Button,
    useBreakpointValue,
    Flex,
} from '@chakra-ui/react';
import All from '@modules/order/templates/all';
import Processing from '@modules/order/templates/processing';
import Shipped from '@modules/order/templates/shipped';
import Delivered from '@modules/order/templates/delivered';
import Cancelled from '@modules/order/templates/cancelled';
import Refund from '@modules/order/templates/refund';
import { useOrderTabStore } from '@/zustand/order-tab-state';
import React from 'react';
import { HydrationBoundary } from '@tanstack/react-query';
import { OrderTabsStyle } from './order-tabs-style';


const OrderOverview = ({
    customer,
    dehydratedState,
}: {
    customer: any;
    dehydratedState: any;
}) => {
    const orderActiveTab = useOrderTabStore((state) => state.orderActiveTab);

    const setOrderActiveTab = useOrderTabStore(
        (state) => state.setOrderActiveTab
    );

    const handleTabChange = (tab: string) => {
        if (orderActiveTab !== tab) {
            setOrderActiveTab(tab);
        }
    };

    const isMobile = useBreakpointValue({ base: true, md: false });

    const renderTabContent = () => {
        switch (orderActiveTab) {
            case TABS.PROCESSING:
                return <Processing customer={customer.id} isEmpty={true} />;
            case TABS.SHIPPED:
                return <Shipped customer={customer.id} isEmpty={true} />;
            case TABS.DELIVERED:
                return <Delivered customer={customer.id} isEmpty={true} />;
            case TABS.CANCELLED:
                return <Cancelled customer={customer.id} isEmpty={true} />;
            case TABS.REFUND:
                return <Refund customer={customer.id} isEmpty={true} />;
            default:
                return <All customer={customer.id} />;
        }
    };

    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            color="white"
            width={'100%'}
        >
            {isMobile ? null : (
                <ButtonGroup
                    width={'100%'}
                    isAttached
                    justifyContent="center"
                    mb={4}
                >
                    {Object.values(TABS).map((tab) => (
                        <Button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            {...OrderTabsStyle}
                            isActive={orderActiveTab === tab}
                        >
                            {tab}
                        </Button>
                    ))}
                </ButtonGroup>
            )}
            <HydrationBoundary state={dehydratedState}>{renderTabContent()}</HydrationBoundary>
        </Flex>
    );
};

export default OrderOverview;
