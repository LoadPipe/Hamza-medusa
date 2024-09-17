import React, { useState } from 'react';
import { Flex, Box, Skeleton, Badge } from '@chakra-ui/react';
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
        // Calculate the remaining categories after the current start index
        const remainingCategories = uniqueCategories.length - startIdx;

        // If fewer than 3 categories are left, increase by the remaining count, otherwise increase by 3
        const increment = remainingCategories >= 3 ? 3 : remainingCategories;

        // Calculate the new index
        const nextIndex = startIdx + increment;

        // If the nextIndex exceeds the array length, loop back to the start
        setStartIdx(nextIndex >= uniqueCategories.length ? 0 : nextIndex);
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
                    bg="linear-gradient(90deg, rgba(2, 2, 2, 0) 0%, #020202 30%)"
                    userSelect={'none'}
                    role="group"
                >
                    <Flex
                        ml="auto"
                        w="60px"
                        h="60px" // Set height and width for the circle effect
                        justifyContent={'center'}
                        alignItems={'center'}
                        alignSelf={'center'}
                        borderRadius="50%" // Make it a circle
                        transition="background-color 0.3s, border 0.3s" // Smooth transition for background and border
                        _hover={{
                            backgroundColor: '#272727',
                        }}
                        role="group"
                    >
                        <CgChevronRight size="2.5rem" color="white" />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default FilterBarStore;
