'use client';

import React, { useState } from 'react';
import { Box, Text, Heading, Flex, Skeleton, Button } from '@chakra-ui/react';
import CategoryButton from './category-button';
import ReviewButton from './review-button';
import FilterButton from './filter-button';
import RangeSlider from './range-slider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import FilterIcon from '../../assets/filter-button.svg';
import useStorePage from '@store/store-page/store-page';
import useSideFilter from '@store/store-page/side-filter';
import useShopFilter from '@/store/store-page/shop-filter';
import All from '@/images/categories/all.svg';

interface Category {
    id: string;
    name: string;
    metadata: {
        icon_url: string;
    };
}

const USE_PRICE_FILTER: boolean = false;

type RangeType = [number, number];

const SideMenu = () => {
    const [range, setRange] = useState<RangeType>([0, 350]);

    // Use Zustand shop to handle filter object
    const { setCategorySelect, setCategoryItem } = useStorePage();

    const {
        selectCategoryShopFilter,
        setSelectCategoryShopFilter,
        setCategoryItemShopFilter,
        categoryItemShopFilter,
        setPriceHi,
        setPriceLo,
        priceHi,
        priceLo,
    } = useShopFilter();

    const isDisabled = selectCategoryShopFilter?.length === 0;

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

    // Skeletons for loading state
    const skeletonButtons = Array(12)
        .fill(null)
        .map((_, index) => (
            <Skeleton
                key={index}
                height="48px"
                maxWidth={'145px'}
                width="100%"
                borderRadius="full"
            />
        ));

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
            <RangeSlider range={range} setRange={setRange} />
            {/* Slider end */}

            {/* Crypto Currencies */}

            {/* Categories */}
            <Box mt="2rem">
                <Heading as="h2" size="h2">
                    Category
                </Heading>

                <Flex mt="1rem" flexDirection={'column'} gap="16px">
                    {isLoading
                        ? skeletonButtons // Show skeletons while loading
                        : uniqueCategories.map((category, index) => (
                              <CategoryButton
                                  key={index}
                                  categoryName={category.name}
                                  url={category.metadata?.icon_url}
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
                <Button
                    isDisabled={isDisabled}
                    onClick={() => {
                        // Delete current settings
                        setCategorySelect([]);

                        // Update settings
                        if (
                            (selectCategoryShopFilter?.length > 0 &&
                                categoryItemShopFilter?.length > 0) ||
                            range.length > 0
                        ) {
                            console.log('range 0:', range[0]);
                            console.log('range 1:', range[1]);
                            setPriceLo(range[0]);
                            setPriceHi(range[1]);
                            console.log('price lo:', priceLo);
                            console.log('price hi:', priceHi);
                            setCategorySelect(selectCategoryShopFilter);
                            setCategoryItem(categoryItemShopFilter);
                            // Reset side menu states
                            // setSelectCategoryStoreFilter([]);
                            setCategoryItemShopFilter([]);
                            setRange([range[0], range[1]]);
                        }

                        // Scroll to the top of the page
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                        });
                    }}
                    backgroundColor={'secondary.onyx.900'}
                    borderRadius={'56px'}
                    borderWidth={'1px'}
                    borderColor={'white'}
                    width="100%"
                    h={'3.5rem'}
                    _hover={{
                        backgroundColor: isDisabled
                            ? 'secondary.onyx.900'
                            : 'secondary.onyx.700',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                    }}
                >
                    <Flex>
                        <Image
                            src={FilterIcon}
                            alt="Filter Button"
                            width={24}
                            height={24}
                        />
                        <Text ml="1rem" color={'white'} fontSize={'18px'}>
                            Apply Filter
                        </Text>
                    </Flex>
                </Button>
            </Box>
        </Box>
    );
};

export default SideMenu;
