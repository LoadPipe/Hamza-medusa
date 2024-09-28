import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { ReactElement } from 'react';

type AccountNavLinkProps = {
    href: string;
    title: string;
    route: string;
    icon?: ReactElement;
};
const NavLinkMobile = ({ href, route, title, icon }: AccountNavLinkProps) => {
    return (
        <Link href={href}>
            <Flex
                width={'100%'}
                backgroundColor={'transparent'}
                alignItems={'center'}
            >
                {icon && icon}
                <Text ml={2} fontSize={'16px'}>
                    {title}
                </Text>
            </Flex>
        </Link>
    );
};

export default NavLinkMobile;
