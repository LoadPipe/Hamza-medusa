import React, { useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import CategoryTopButton from './category-top-button';
import { CgChevronRight } from 'react-icons/cg';
import vendors from '@modules/home/components/search-and-filter-panel/data/data';

const FilterBarStore = () => {
    const [startIdx, setStartIdx] = useState(0);

    const toggleShowMore = () => {
        // Update the starting index to show the next set of vendors
        const nextIndex = (startIdx + 1) % vendors.length; // Cycle through the list
        setStartIdx(nextIndex);
    };

    const visibleVendors = vendors
        .slice(startIdx, startIdx + 6)
        .concat(vendors.slice(0, Math.max(0, 6 - (vendors.length - startIdx))));

    return (
        <Flex
            maxW={'941px'}
            width={'100%'}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <Flex
                maxW={'941px'}
                w={'100%'}
                overflow={'hidden'}
                gap={{ base: '12px', md: '20px' }}
                position="relative"
            >
                <Flex
                    maxW={'941px'}
                    width={'100%'}
                    overflow={'hidden'}
                    gap={{ base: '12px', md: '20px' }}
                >
                    {visibleVendors.map((vendor: any, index) => (
                        <CategoryTopButton
                            key={index}
                            categoryType={vendor.vendorType}
                            categoryName={vendor.vendorName}
                        />
                    ))}
                </Flex>
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
                    bg="linear-gradient(90deg, rgba(44, 39, 45, 0) 0%, #0a090b 75%)"
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
        </Flex>
    );
};

export default FilterBarStore;
