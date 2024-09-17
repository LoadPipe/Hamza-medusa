import React, { useState } from 'react';
import { Flex, Box, Skeleton } from '@chakra-ui/react';
import CategoryTopButton from './category-top-button';
import { CgChevronRight } from 'react-icons/cg';
import useVendors from '@modules/home/components/search-and-filter-panel/data/data';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Category {
    id: string;
    name: string;
    metadata: {
        icon_url: string;
    };
}
const FilterBarStore = () => {
    const [startIdx, setStartIdx] = useState(0); // State to keep track of the starting index of visible categories
    const [showLeftChevron, setShowLeftChevron] = useState(false); // Track if left chevron should be shown

    // Fetching categories data
    const { data, isLoading } = useQuery<Category[]>(
        ['categories'],
        async () => {
            const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/category/all`;
            const response = await axios.get(url);
            return response.data;
        }
    );

    // Extract unique category names with id
    const uniqueCategories: Category[] = data
        ? data.map((category) => ({
              name: category.name,
              id: category.id,
              metadata: category.metadata,
          }))
        : [];

    const toggleShowMore = () => {
        // Calculate the maximum allowed index (3 more than the length of the array)
        const maxIndex = uniqueCategories.length + 3;

        // Increment index by 1
        let nextIndex = startIdx + 1;

        // Stop incrementing if the next index is equal to or greater than the max index
        if (nextIndex >= maxIndex) {
            return; // Do nothing
        }

        // Otherwise, update the index
        setStartIdx(nextIndex);
    };
    // Logic to handle the scrolling. Visible categories will shift based on `startIdx`.
    const visibleCategories = uniqueCategories
        .slice(startIdx)
        .concat(uniqueCategories.slice(0, startIdx));

    const skeletons = Array(7)
        .fill(null)
        .map((_, index) => (
            <Skeleton
                key={index}
                height={{ base: '42px', md: '63px' }}
                width="123px"
                borderRadius="49px"
            />
        ));

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
                    <CategoryTopButton
                        categoryName={'All'}
                        url={'https://images.hamza.biz/category-icons/all.svg'}
                    />
                    {isLoading
                        ? skeletons // Show skeletons while loading
                        : visibleCategories.map((category, index) => (
                              <CategoryTopButton
                                  key={index}
                                  categoryName={category.name}
                                  url={category.metadata?.icon_url}
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
