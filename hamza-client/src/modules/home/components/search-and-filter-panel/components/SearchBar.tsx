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
            mt={{ base: '2rem', md: '3rem' }}
            width="100%"
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
        >
            <InputGroup mx="1rem" maxW={{ base: '100%', md: '964px' }}>
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
                    textOverflow={'ellipsis'}
                    whiteSpace={'nowrap'}
                    paddingRight={{ base: '14rem', md: '0' }}
                    overflow={'hidden'}
                    placeholder="Search for product name, product type, brand name, category, etc..."
                    _placeholder={{ color: '#3E3E3E' }}
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
                    mr="5"
                    ml="5"
                    fontSize={{ base: '20px', md: '28px' }}
                >
                    <FaSearch color="#3E3E3E" />
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
