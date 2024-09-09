import React, { useState } from 'react';
import { Flex, useDisclosure, Skeleton } from '@chakra-ui/react';
import CategoryButtons from './components/CategoryButtons';
import useVendors from '../../data/data';
import FilterButton from './components/FilterButton';
import { CgChevronRight, CgChevronLeft } from 'react-icons/cg'; // Import both chevrons
import FilterModalHome from './components/FilterModal';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// Define the category structure
interface Category {
    id: string;
    name: string;
}

const FilterBar = () => {
    const [startIdx, setStartIdx] = useState(0); // State to keep track of the starting index of visible categories
    const [showLeftChevron, setShowLeftChevron] = useState(false); // Track if left chevron should be shown
    const { isOpen, onOpen, onClose } = useDisclosure();

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
        ? data.map((category) => ({ name: category.name, id: category.id }))
        : [];

    // Show more logic for categories (next or previous)
    const toggleShowMore = (direction: 'next' | 'prev') => {
        const isAtStart = startIdx === 0;
        const isAtEnd = startIdx + 6 >= uniqueCategories.length;

        let nextIndex;

        if (direction === 'next') {
            nextIndex = isAtEnd ? 0 : startIdx + 1;
            setShowLeftChevron(true); // Show left chevron when moving to next
        } else {
            nextIndex = isAtStart ? uniqueCategories.length - 1 : startIdx - 1;
            if (nextIndex === 0) {
                setShowLeftChevron(false); // Hide left chevron when back to the start
            }
        }

        setStartIdx(nextIndex);
    };

    // Logic to display only 6 categories at a time
    let visibleCategories = uniqueCategories
        .slice(startIdx, startIdx + 6)
        .concat(
            uniqueCategories.slice(
                0,
                Math.max(0, 6 - (uniqueCategories.length - startIdx))
            )
        );

    if (uniqueCategories.length === 1)
        visibleCategories = [visibleCategories[0]];

    // Determine if the user is at the end to toggle the chevron direction
    const isAtEnd = startIdx + 6 >= uniqueCategories.length;

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
                <FilterButton onClick={onOpen} />

                <CategoryButtons categoryType={'All'} categoryName={'All'} />
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
                        : visibleCategories.map((category, index) => (
                              <CategoryButtons
                                  key={index}
                                  categoryType={category.id}
                                  categoryName={category.name}
                              />
                          ))}
                </Flex>

                {/* Conditional rendering of Chevron */}
                <Flex
                    w="123px"
                    height={{ base: '42px', md: '63px' }}
                    justifyContent={'center'}
                    alignItems={'center'}
                    onClick={() => toggleShowMore('next')}
                    cursor="pointer"
                    position="absolute"
                    right="0"
                    top="0"
                    bg="linear-gradient(90deg, rgba(44, 39, 45, 0) 0%, #2C272D 75%)"
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
            <FilterModalHome
                categories={uniqueCategories}
                isOpen={isOpen}
                onClose={onClose}
            />
        </Flex>
    );
};

export default FilterBar;
