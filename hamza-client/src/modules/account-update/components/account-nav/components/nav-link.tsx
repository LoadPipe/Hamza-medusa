import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type AccountNavLinkProps = {
    href: string;
    title: string;
    route: string;
};
const NavLink = ({ href, route, title }: AccountNavLinkProps) => {
    const { countryCode }: { countryCode: string } = useParams();
    const active = route.split(countryCode)[1] === href;
    return (
        <Link href={href}>
            <Flex
                borderRadius={'8px'}
                width={'245px'}
                padding="16px"
                color={active ? 'black' : 'white'}
                backgroundColor={active ? 'primary.green.900' : 'transparent'}
                alignItems={'center'}
            >
                <Text fontSize={'18px'} fontWeight={600}>
                    {title}
                </Text>
            </Flex>
        </Link>
    );
};

export default NavLink;
