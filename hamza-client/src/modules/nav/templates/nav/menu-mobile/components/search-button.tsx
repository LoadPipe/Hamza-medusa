'use client';

import { Flex } from '@chakra-ui/react';
import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchButtonMobileProps {
    onClick: () => void;
}

export default function SearchButtonMobile({ onClick }: SearchButtonMobileProps) {
    return (
        <Flex
            alignSelf={'center'}
            ml="0.5rem"
            cursor="pointer"
            onClick={onClick}
            _hover={{
                '.search-icon': {
                    color: 'primary.green.900',
                    transition: 'color 0.3s ease-in-out',
                },
            }}
        >
            <FaSearch
                className="search-icon"
                size={'25px'}
                color="white"
            />
        </Flex>
    );
}