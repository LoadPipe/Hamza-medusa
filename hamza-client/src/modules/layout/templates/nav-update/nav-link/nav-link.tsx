'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { Text, Box, Flex } from '@chakra-ui/react';

interface NavLinkProps {
    href: string;
    title: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, title }) => {
    const { countryCode } = useParams();
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <Link
            style={{ borderWidth: '1px', borderColor: 'transparent' }}
            href={`/${countryCode}${href}`}
        >
            <Flex
                h="100%"
                p="4"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Text
                    className="text-base font-semibold"
                    alignSelf={'center'}
                    color={isHovered ? '#94D42A' : 'white'}
                >
                    {title}
                </Text>
            </Flex>
        </Link>
    );
};

export default NavLink;
