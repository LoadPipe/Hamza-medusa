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
};

const NavLinkMobile = ({
    href,
    route,
    title,
    icon,
    onClick,
}: AccountNavLinkProps) => {
    return (
        <Link href={href} style={{ width: '100%' }}>
            <Flex
                as="a"
                width={'100%'}
                alignItems={'center'}
                onClick={onClick} // Trigger onClick if provided
                cursor="pointer"
            >
                {icon && icon}
                <Text
                    ml={icon ? 2 : 0}
                    fontSize={'16px'}
                    fontWeight={route === href ? 'bold' : 'normal'}
                >
                    {title}
                </Text>
            </Flex>
        </Link>
    );
};

export default NavLinkMobile;
