import React, { useEffect, useState } from 'react';
import { Flex, useDisclosure } from '@chakra-ui/react';
import CategoryButtons from './components/CategoryButtons';
import useVendors from '../../data/data';
import FilterButton from './components/FilterButton';
import { CgChevronRight } from 'react-icons/cg';
import FilterModalHome from './components/FilterModal';

const FilterBar = () => {
    const [isClient, setIsClient] = useState(false);
    const [startIdx, setStartIdx] = useState(0); // State to keep track of the starting index of visible vendors
    const { isOpen, onOpen, onClose } = useDisclosure();

    const vendors = useVendors();
    // Ensure that the components knows when it's running on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    const toggleShowMore = () => {
        // Update the starting index to show the next set of vendors
        const nextIndex = (startIdx + 1) % vendors.length; // Cycle through the list
        setStartIdx(nextIndex);
    };

    let visibleVendors = vendors
        .slice(startIdx, startIdx + 6)
        .concat(vendors.slice(0, Math.max(0, 6 - (vendors.length - startIdx))));

    if (vendors.length == 1) visibleVendors = [visibleVendors[0]];

    return (
        <Flex
            mt={{ base: '0.5rem', md: '2rem' }}
            maxW={'1280px'}
            width={'100%'}
            alignItems={'center'}
            justifyContent={'center'}
            py="2rem"
        >
            <Flex
                mx="1rem"
                maxW={'1249px'}
                width={'100%'}
                overflow={'hidden'}
                gap={{ base: '12px', md: '20px' }}
                position="relative"
            >
                <FilterButton onClick={() => onOpen()} />
                {/* <Flex
                    maxW={'1100px'}
                    width={'100%'}
                    overflow={'hidden'}
                    gap={{ base: '12px', md: '20px' }}
                >
                    {visibleVendors.map((vendor: any, index) => (
                        <CategoryButtons
                            key={index}
                            categoryType={vendor.vendorType}
                            // categoryType="lego"
                            categoryName={vendor.vendorName}
                        />
                    ))}
                </Flex> */}
                <Flex
                    w="123px"
                    height={{ base: '42px', md: '63px' }}
                    justifyContent={'center'}
                    alignItems={'center'}
                    onClick={toggleShowMore}
                    cursor="pointer"
                    position="absolute"
                    right="0"
                    top="0"
                    bg="linear-gradient(90deg, rgba(44, 39, 45, 0) 0%, #2C272D 75%)" // Applying linear gradient
                    userSelect={'none'}
                >
                    <Flex
                        ml="auto"
                        w="35px"
                        mr="0.75rem"
                        height={'100%'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        alignSelf={'center'}
                    >
                        <CgChevronRight size="4rem" color="white" />
                    </Flex>
                </Flex>
            </Flex>
            <FilterModalHome isOpen={isOpen} onClose={onClose} />
        </Flex>
    );
};

export default FilterBar;
