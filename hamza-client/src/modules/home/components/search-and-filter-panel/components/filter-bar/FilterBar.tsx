import React, { useState } from 'react';
import { Flex, useDisclosure, Skeleton } from '@chakra-ui/react';
import CategoryButton from '@/modules/products/components/buttons/category-button';
import FilterButton from './components/FilterButton';
import { CgChevronRight, CgChevronLeft } from 'react-icons/cg'; // Import both chevrons
import FilterModalHome from './components/FilterModal';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// Define the category structure
interface Category {
    id: string;
    name: string;
    metadata: {
        icon_url: string;
    };
}

const FilterBar = () => {
    const [startIdx, setStartIdx] = useState(0); // State to keep track of the starting index of visible categories
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Fetching categories data
    const { data, isLoading } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async() =>
    {
        const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/category/all`;
        const response = await axios.get(url);
        return response.data;
    }
});

    // Extract unique category names with id
    const uniqueCategories: Category[] = data
        ? data.map((category) => ({
              name: category.name,
              id: category.id,
              metadata: category.metadata,
          }))
        : [];

    // Show more logic for categories (next or previous)
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

    // Placeholder skeletons to be shown while loading
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
            mt={{ base: '0.5rem', md: '0' }}
            maxW={'1280px'}
            width={'100%'}
            alignItems={'center'}
            justifyContent={'center'}
            className="filter-bar"
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
                <FilterButton onClick={onOpen} />

                <CategoryButton
                    categoryName={'All'}
                    url={'https://images.hamza.market/category-icons/all.svg'}
                />
                <Flex
                    maxW={'1100px'}
                    width={'100%'}
                    overflow={'hidden'}
                    gap={{ base: '12px', md: '20px' }}
                >
                    {/* <Flex
                        w="123px" // Same width as right chevron
                        height={{ base: '42px', md: '63px' }}
                        cursor="pointer"
                        onClick={() => toggleShowMore('prev')} // Handle going backward
                        position="absolute"
                        left="0" // Align left
                        top="0"
                        bg="linear-gradient(270deg, rgba(44, 39, 45, 0) 0%, #2C272D 75%)"
                        // Same gradient but mirrored
                        userSelect={'none'}
                    >
                        <Flex
                            w="35px"
                            ml="0.75rem"
                            height={'100%'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            alignSelf={'center'}
                        >
                            <CgChevronLeft size="4rem" color="white" />
                        </Flex>
                    </Flex> */}
                    {isLoading
                        ? skeletons // Show skeletons while loading
                        : visibleCategories.map((category, index) => {
                              return (
                                  <CategoryButton
                                      key={index}
                                      categoryName={category.name}
                                      url={category.metadata?.icon_url}
                                  />
                              );
                          })}
                </Flex>

                {/* Conditional rendering of Chevron */}
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
                    bg="linear-gradient(90deg, rgba(44, 39, 45, 0) 0%, #2C272D 65%)"
                    userSelect={'none'}
                    className="filter-bar-chevron"
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
            <FilterModalHome
                categories={uniqueCategories}
                isOpen={isOpen}
                onClose={onClose}
            />
        </Flex>
    );
};

export default FilterBar;
