import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { ReactElement } from 'react';
import { useParams } from 'next/navigation';
import { useOrderTabStore } from '@/zustand/order-tab-state';

type AccountNavLinkProps = {
    href: string;
    title: string;
    route: string;
    tab: string;
    icon?: ReactElement;
    onClick?: () => void;
    fontWeight?: number | string;
    handleTabChange?: () => void;
};

const NavLinkMobileOrders = ({
    href,
    route,
    title,
    tab,
    icon,
    onClick,
    fontWeight,
    handleTabChange,
}: AccountNavLinkProps) => {
    const { countryCode }: { countryCode: string } = useParams();
    const currentHref = route.split(countryCode)[1] === href;
    const { orderActiveTab } = useOrderTabStore();
    const activeTab = orderActiveTab;
    const active = activeTab === tab;

    const handleClick = () => {
        if (handleTabChange) {
            handleTabChange();
        }
        if (onClick) {
            onClick();
        }
    };

    return (
        <Link href={href} style={{ width: '100%' }}>
            <Flex
                width={'100%'}
                alignItems={'center'}
                onClick={handleClick}
                cursor="pointer"
            >
                <Flex width={'22px'} height={'22px'}>
                    {icon && icon}
                </Flex>
                <Text
                    ml={icon ? 2 : 0}
                    fontSize={'16px'}
                    fontWeight={fontWeight}
                    color={
                        active && currentHref ? 'primary.green.900' : 'white'
                    }
                >
                    {title}
                </Text>
            </Flex>
        </Link>
    );
};

export default NavLinkMobileOrders;
