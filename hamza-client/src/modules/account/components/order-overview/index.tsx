'use client';
import { TABS } from '@/modules/order-tab-management';
import {
    ButtonGroup,
    Button,
    useBreakpointValue,
    Flex,
} from '@chakra-ui/react';
import All from '@/modules/order/templates/all';
import Processing from '@modules/order/templates/processing';
import Shipped from '@modules/order/templates/shipped';
import Delivered from '@modules/order/templates/delivered';
import Cancelled from '@modules/order/templates/cancelled';
import Refund from '@/modules/order/templates/refunded';
import { useOrderTabStore } from '@/zustand/order-tab-state';
import React, { useEffect } from 'react';
import { OrderTabsStyle } from './order-tabs-style';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const OrderOverview = ({ customer }: { customer: any }) => {
    const orderActiveTab = useOrderTabStore((state) => state.orderActiveTab);
    const setOrderActiveTab = useOrderTabStore(
        (state) => state.setOrderActiveTab
    );
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize tab from URL parameter
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && Object.values(TABS).includes(tabParam)) {
            setOrderActiveTab(tabParam);
        }
    }, [searchParams, setOrderActiveTab]);

    const handleTabChange = (tab: string) => {
        if (orderActiveTab !== tab) {
            setOrderActiveTab(tab);
            // Update URL with new tab
            const params = new URLSearchParams(searchParams);
            params.set('tab', tab);
            router.push(`${pathname}?${params.toString()}`);
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
            {renderTabContent()}
        </Flex>
    );
};

export default OrderOverview;
