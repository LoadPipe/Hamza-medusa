'use client';

import React from 'react';
import {
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SearchModal from '@modules/search/templates/search-modal';
import { getRegion } from 'app/actions';

const NavSearchBar = () => {
    const [searchOpened, setSearchOpened] = useState(false);
    const pathname = usePathname();
    //Todo: get country code
    const isHomePage = pathname === '/us';

    useEffect(() => {
        window.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key == 'k') {
                setSearchOpened(true);
            }
        });
    }, []);

    useEffect(() => {
        setSearchOpened(false);
    }, [pathname]);

    return (
        <>
            <InputGroup display={'flex'} mx="1rem">
                <Input
                    width={'100%'}
                    height={'80px'}
                    border="1px solid"
                    borderRadius="16px"
                    borderColor="#555555"
                    backgroundColor="#121212"
                    pl="4rem"
                    fontSize={{ base: '14px', md: '16px' }}
                    color="#3E3E3E"
                    placeholder="Search for product name, product..."
                    _placeholder={{ color: '#555555' }}
                    _hover={{ borderColor: 'primary.green.900' }}
                    cursor={'pointer'}
                    noOfLines={1}
                    onClick={() => {
                        setSearchOpened(true);
                    }}
                />
                <InputLeftElement
                    height="100%"
                    display="flex"
                    alignItems="center"
                    pointerEvents="none"
                    ml="1rem"
                    fontSize={{ base: '20px', md: '28px' }}
                >
                    <FaSearch color="white" />
                </InputLeftElement>
            </InputGroup>
            {searchOpened && (
                <SearchModal
                    closeModal={() => {
                        setSearchOpened(false);
                    }}
                />
            )}
        </>
    );
};

export default NavSearchBar;
