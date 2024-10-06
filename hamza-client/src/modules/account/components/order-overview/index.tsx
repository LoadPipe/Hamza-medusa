'use client';

import { TABS } from 'modules/order-tab-management';
import {
    Box,
    ButtonGroup,
    Button,
    Select,
    useBreakpointValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react';
import All from '@modules/order/templates/all';
import Processing from '@modules/order/templates/processing';
import Shipped from '@modules/order/templates/shipped';
import Delivered from '@modules/order/templates/delivered';
import Cancelled from '@modules/order/templates/cancelled';
import Refund from '@modules/order/templates/refund';
import { useOrderTabStore } from '@store/order-tab-state';
import React from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { IoSettingsOutline } from 'react-icons/io5';

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

const OrderOverview = ({
    customer,
    ordersExist,
}: {
    customer: any;
    ordersExist: boolean;
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
                return <All customer={customer.id} ordersExist={ordersExist} />;
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
            {isMobile ? (
                <Menu>
                    <MenuButton
                        as={Button}
                        height="56px"
                        backgroundColor={'#121212'}
                        color="primary.green.900"
                        rightIcon={<ChevronDownIcon color="white" />}
                        _hover={{ backgroundColor: '#121212' }}
                        _active={{
                            backgroundColor: '#121212',
                            borderColor: '#555555',
                            borderWidth: '1px',
                        }}
                        _focus={{
                            boxShadow: 'none',
                        }}
                    >
                        {orderActiveTab}
                    </MenuButton>
                    <MenuList
                        color={'white'}
                        width={'calc(80vw - 2rem)'}
                        backgroundColor={'#121212'}
                        borderColor={'#555555'}
                        padding={'0'}
                        margin={'0'}
                    >
                        {Object.values(TABS).map((tab) => (
                            <MenuItem
                                width={'100%'}
                                key={tab}
                                value={tab}
                                backgroundColor="#333"
                                color="#fff"
                                _hover={{ backgroundColor: '#444' }}
                                padding="12px"
                                onClick={() => handleTabChange(tab)}
                            >
                                {tab}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            ) : (
                <ButtonGroup isAttached justifyContent="center">
                    {Object.values(TABS).map((tab) => (
                        <Button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            {...commonButtonStyles}
                            isActive={orderActiveTab === tab}
                            w={['100%', '100%', '30%']} // Full width on smaller screens, 30% on larger
                        >
                            {tab}
                        </Button>
                    ))}
                </ButtonGroup>
            )}
            {renderTabContent()}
        </Box>
    );
};

export default OrderOverview;
