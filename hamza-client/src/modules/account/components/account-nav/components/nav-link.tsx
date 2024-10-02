import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ReactElement } from 'react';

type AccountNavLinkProps = {
    href: string;
    title: string;
    route: string;
    fontSize?: string;
    icon?: ReactElement;
};
const NavLink = ({
    href,
    route,
    title,
    icon,
    fontSize = '18px',
}: AccountNavLinkProps) => {
    const { countryCode }: { countryCode: string } = useParams();
    const active = route.split(countryCode)[1] === href;
    return (
        <Link href={href}>
            <Flex
                borderRadius={'8px'}
                height={'56px'}
                padding="16px"
                color={active ? 'black' : 'white'}
                backgroundColor={active ? '#121212' : 'transparent'}
                alignItems={'center'}
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
                    fontSize={fontSize}
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
