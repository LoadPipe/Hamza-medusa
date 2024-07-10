import React from 'react';
import { Flex, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SearchModal from '@modules/search/templates/search-modal';

const SearchBar = () => {
    const [searchOpened, setSearchOpened] = useState(false);
    const pathname = usePathname();

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
        <Flex
            width="100%"
            display={{ base: 'flex', md: 'none' }}
            justifyContent={'center'}
            alignItems={'center'}
        >
            <InputGroup>
                <Input
                    height={{ base: '52px', md: '86px' }}
                    width={'100%'}
                    padding="16px 8px 16px 28px"
                    border="2px solid"
                    borderRadius="40px"
                    borderColor="#3E3E3E"
                    backgroundColor="black"
                    fontSize={{ base: '14px', md: '22px' }}
                    color="#3E3E3E"
                    placeholder=""
                    _placeholder={{ color: '#3E3E3E' }}
                    _hover={{ borderColor: 'primary.green.900' }}
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
                    mr="5"
                    ml="5"
                    fontSize={{ base: '20px', md: '28px' }}
                >
                    <FaSearch color="white" />
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

export default SearchBar;
