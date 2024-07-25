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
                height={'56px'}
                padding="16px"
                color={active ? 'black' : 'white'}
                backgroundColor={active ? '#121212' : 'transparent'}
                alignItems={'center'}
            >
                <Text
                    my="auto"
                    fontSize={'18px'}
                    color={active ? 'primary.green.900' : 'white'}
                    fontWeight={600}
                >
                    {title}
                </Text>
            </Flex>
        </Link>
    );
};

export default NavLink;
