'use client';

import React from 'react';
import { Box, Text, Heading, Flex, useMediaQuery } from '@chakra-ui/react';
import CurrencyButton from './currency-button';
import CategoryButton from './category-button';
import currencies from '../data/currency-category';
import ReviewButton from './review-button';
import FilterButton from './filter-button';
import RangeSlider from './range-slider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Category {
    id: string;
    name: string;
}

const SideMenu = () => {
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

    return (
        <Box
            display={{ base: 'none', md: 'block' }}
            p="1.5rem"
            color={'white'}
            borderRadius={'20px'}
            width={'348.74px'}
            backgroundColor={'secondary.onyx.900'}
        >
            <Heading as="h2" size="h2">
                Price Range
            </Heading>
            <Text mt="5px" color="secondary.davy.900">
                Prices before fees and taxes
            </Text>

            {/* Slider  */}
            <RangeSlider />
            {/* Slider end */}

            {/* Crypto Currencies */}

            {/* Categories */}
            <Box mt="2rem">
                <Heading as="h2" size="h2">
                    Category
                </Heading>

                <Flex mt="1rem" flexDirection={'column'} gap="16px">
                    {uniqueCategories.map((category, index) => (
                        <CategoryButton
                            key={index}
                            categoryType={category.id}
                            categoryName={category.name}
                        />
                    ))}
                </Flex>
            </Box>

            {/* Rating */}
            {/* <Box mt="2rem">
                <Heading as="h2" size="h2">
                    Rating
                </Heading>

                <Flex mt="1rem" flexDirection={'column'} gap="16px">
                    <ReviewButton title={'All'} value={'All'} />
                    <ReviewButton title={'4 Stars'} value={'4'} />
                    <ReviewButton title={'3 Stars'} value={'3'} />
                    <ReviewButton title={'2 Stars'} value={'2'} />
                    <ReviewButton title={'1 Star'} value={'1'} />
                </Flex>
            </Box> */}

            <Box mt="2rem">
                <FilterButton />
            </Box>
        </Box>
    );
};

export default SideMenu;
