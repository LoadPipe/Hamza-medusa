import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';

import { ReactElement } from 'react';
import { useOrderTabStore } from '@store/order-tab-state';

type AccountNavLinkProps = {
    href: string;
    title: string;
    route: string;
    tab: string;
    icon?: ReactElement;
    handleTabChange?: () => void;
};
const NavLinkOrders = ({
    href,
    title,
    route,
    tab,
    icon,
    handleTabChange,
}: AccountNavLinkProps) => {
    const { orderActiveTab } = useOrderTabStore();
    const activeTab = orderActiveTab;
    const active = activeTab === tab;

    const handleClick = () => {
        if (handleTabChange) {
            handleTabChange();
        }
    };

    return (
        <Link href={href}>
            <Flex
                borderRadius={'8px'}
                height={'56px'}
                padding="16px"
                color={active ? 'black' : 'white'}
                backgroundColor={active ? '#121212' : 'transparent'}
                alignItems={'center'}
                onClick={handleClick}
            >
                <Flex
                    width={'26px'}
                    height={'26px'}
                    color={active ? 'primary.green.900' : 'white'}
                >
                    {icon && icon}
                </Flex>
                <Text
                    ml={2}
                    my="auto"
                    fontSize={'16px'}
                    color={active ? 'primary.green.900' : 'white'}
                    fontWeight={600}
                >
                    {title}
                </Text>
            </Flex>
        </Link>
    );
};

export default NavLinkOrders;
