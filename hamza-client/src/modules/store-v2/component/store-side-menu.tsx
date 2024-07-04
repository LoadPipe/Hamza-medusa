'use client';

import React from 'react';
import { Box, Text, Heading, Flex, useMediaQuery } from '@chakra-ui/react';
import CurrencyButton from './currency-button';
import CategoryButton from './category-button';
import currencies from '../data/currency-category';
import ReviewButton from './review-button';
import FilterButton from './filter-button';
import RangeSlider from './range-slider';

const SideMenu = () => {
    const [isLargerThan820] = useMediaQuery('(min-width: 800px)');

    return (
        <Box
            display={isLargerThan820 ? 'block' : 'none'}
            p="2rem"
            mr="auto"
            color={'white'}
            borderRadius={'20px'}
            width={'348.74px'}
            height={'1900px'}
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
            <Box mt="2rem">
                <Heading as="h2" size="h2">
                    Cryptocurrency
                </Heading>
                <Text mt="5px" color="secondary.davy.900">
                    Pay with different cryptocurrencies
                </Text>

                <Flex mt="1rem" flexDirection={'column'} gap="16px">
                    {Object.keys(currencies).map((key) => (
                        <CurrencyButton
                            key={key}
                            currencyName={
                                (currencies as { [key: string]: any })[key]
                            }
                        />
                    ))}
                </Flex>
            </Box>

            {/* Categories */}
            <Box mt="2rem">
                <Heading as="h2" size="h2">
                    Stores
                </Heading>

                <Flex mt="1rem" flexDirection={'column'} gap="16px">
                    <CategoryButton
                        categoryType="home_light"
                        categoryName="All"
                    />
                    <CategoryButton
                        categoryType="home_light"
                        categoryName="Legendary Light Design"
                    />
                    <CategoryButton
                        categoryType="gadgets"
                        categoryName="Dauntless"
                    />
                    <CategoryButton
                        categoryType="clothes"
                        categoryName="Medusa Merch"
                    />
                    <CategoryButton
                        categoryType="games"
                        categoryName="Drones"
                    />
                    <CategoryButton categoryType="games" categoryName="Legos" />
                    <CategoryButton
                        categoryType="board_games"
                        categoryName="Board Games"
                    />
                    <CategoryButton
                        categoryType="workout_gear"
                        categoryName="Workout Gear"
                    />
                    <CategoryButton
                        categoryType="games"
                        categoryName="Echo Rift"
                    />
                    <CategoryButton
                        categoryType="games"
                        categoryName="Gaming Gear"
                    />
                </Flex>
            </Box>

            {/* Rating */}
            <Box mt="2rem">
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
            </Box>

            <Box mt="2rem">
                <FilterButton />
            </Box>
        </Box>
    );
};

export default SideMenu;
