'use client';

import React from 'react';
import { Flex, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
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
            <InputGroup mx="2rem" display={isHomePage ? 'none' : 'block'}>
                <Input
                    width={'100%'}
                    height={'80px'}
                    border="2px solid"
                    borderRadius="40px"
                    borderColor="#555555"
                    backgroundColor="black"
                    fontSize={{ base: '14px', md: '22px' }}
                    color="#3E3E3E"
                    placeholder="Search for product name, product..."
                    _placeholder={{ color: '#555555' }}
                    _hover={{ borderColor: 'primary.indigo.900' }}
                    cursor={'pointer'}
                    noOfLines={1}
                    onClick={() => {
                        setSearchOpened(true);
                    }}
                />
                <InputRightElement
                    height="100%"
                    display="flex"
                    alignItems="center"
                    pointerEvents="none"
                    mr="1rem"
                    fontSize={{ base: '20px', md: '28px' }}
                >
                    <FaSearch color="#555555" />
                </InputRightElement>
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
