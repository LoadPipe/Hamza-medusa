import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { ReactElement } from 'react';

type AccountNavLinkProps = {
    href: string;
    title: string;
    route: string;
    icon?: ReactElement;
    onClick?: () => void;
    fontWeight?: number | string;
    handleTabChange?: () => void;
};

const NavLinkMobileOrders = ({
    href,
    route,
    title,
    icon,
    onClick,
    fontWeight,
    handleTabChange, // Destructure handleTabChange
}: AccountNavLinkProps) => {
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
                onClick={handleClick} // Trigger handleClick
                cursor="pointer"
            >
                <Flex width={'22px'} height={'22px'}>
                    {icon && icon}
                </Flex>
                <Text
                    ml={icon ? 2 : 0}
                    fontSize={'16px'}
                    fontWeight={fontWeight}
                >
                    {title}
                </Text>
            </Flex>
        </Link>
    );
};

export default NavLinkMobileOrders;
