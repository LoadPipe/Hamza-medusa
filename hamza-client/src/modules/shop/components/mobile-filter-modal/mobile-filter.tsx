import React, { useEffect, useState } from 'react';
import mobileFilter from '../../../../../public/images/categories/mobile-filter.svg';
import {
    Flex,
    Box,
    Input,
    InputGroup,
    InputRightElement,
    useDisclosure,
} from '@chakra-ui/react';
import Image from 'next/image';
import { MdChevronLeft } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa';
import FilterModal from './components/filter-modal';
import { usePathname } from 'next/navigation';
import SearchModal from '@modules/search/templates/search-modal';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import RangeSliderModal from './components/range-slider-modal';

const MobileFilter = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
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
            width={'100%'}
            display={{ base: 'flex', md: 'none' }}
            my="2rem"
            px="1rem"
            gap={'12px'}
        >
            {/* back button */}
            <LocalizedClientLink className="self-center" href="/">
                <Box
                    width={'30px'}
                    cursor={'pointer'}
                    color={'white'}
                    _hover={{
                        color: 'primary.green.900',
                        transition: 'color 0.2s ease-in-out',
                    }}
                >
                    <MdChevronLeft size={40} style={{ marginRight: 'auto' }} />
                </Box>
            </LocalizedClientLink>
            {/* search bar */}
            <InputGroup>
                <Input
                    width="100%"
                    height="52px"
                    borderWidth={'2px'}
                    borderColor={'#3E3E3E'}
                    borderRadius={'full'}
                    cursor={'pointer'}
                    _hover={{
                        borderColor: 'primary.green.900',
                    }}
                    onClick={() => {
                        setSearchOpened(true);
                    }}
                />
                <InputRightElement
                    height="100%"
                    display="flex"
                    alignItems="center"
                    pointerEvents="none"
                    mr="3"
                >
                    <FaSearch size={20} color="white" />
                </InputRightElement>
            </InputGroup>
            {searchOpened && (
                <SearchModal
                    closeModal={() => {
                        setSearchOpened(false);
                    }}
                />
            )}
            {/* filter button */}
            <Box>
                <Flex
                    onClick={() => {
                        onOpen();
                    }}
                    wrap={'nowrap'}
                    ml="auto"
                    borderWidth={'2px'}
                    width={'52px'}
                    height={'52px'}
                    borderRadius={'full'}
                    borderColor={'#3E3E3E'}
                    justifyContent={'center'}
                    cursor={'pointer'}
                    color={'white'}
                    _hover={{
                        color: 'primary.green.900',
                        borderColor: 'primary.green.900',
                        transition: 'color 0.2s ease-in-out',
                    }}
                >
                    <Image
                        style={{
                            width: '18px',
                            height: '18px',
                            alignSelf: 'center',
                        }}
                        src={mobileFilter}
                        alt="mobile filter"
                    />
                </Flex>
            </Box>
            <FilterModal isOpen={isOpen} onClose={onClose} />
        </Flex>
    );
};

export default MobileFilter;
