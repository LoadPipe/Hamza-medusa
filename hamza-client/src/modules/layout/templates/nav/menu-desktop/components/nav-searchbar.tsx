'use client';
import React from 'react';
import {
    Box,
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
import { getRegion } from '@/app/actions';
import fslash from '../../.../../../../../../../public/images/nav/search/fslash.svg';
import Image from 'next/image';

const NavSearchBar = () => {
    const [searchOpened, setSearchOpened] = useState(false);
    const pathname = usePathname();
    //Todo: get country code
    const isHomePage =
        pathname === `/${process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'}`;

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
        <Flex width={'100%'} display={{ base: 'none', md: 'flex' }}>
            <InputGroup
                display={isHomePage ? 'none' : 'flex'}
                mx="1rem"
                alignItems={'center'}
            >
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
                    alignItems="center"
                    pointerEvents="none"
                    ml="1rem"
                    fontSize={{ base: '20px', md: '28px' }}
                >
                    <FaSearch color="white" />
                </InputLeftElement>
                <InputRightElement height="100%" mr="1rem">
                    <Flex
                        borderRadius={'10px'}
                        height="47px"
                        width="45px"
                        justifyContent={'center'}
                        alignItems="center"
                        alignSelf={'center'}
                        backgroundColor={'#272727'}
                    >
                        <Image
                            src={fslash}
                            alt="slash"
                            style={{
                                width: '11.39px',
                                height: 'auto',
                            }}
                        />
                    </Flex>
                </InputRightElement>
            </InputGroup>
            {searchOpened && (
                <SearchModal
                    closeModal={() => {
                        setSearchOpened(false);
                    }}
                />
            )}
        </Flex>
    );
};

export default NavSearchBar;
