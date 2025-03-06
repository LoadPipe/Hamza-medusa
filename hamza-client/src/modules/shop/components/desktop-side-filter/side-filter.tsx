'use client';

import React, { useEffect, useState } from 'react';
import { Box, Text, Heading, Flex, Skeleton, Button } from '@chakra-ui/react';
import CategoryButton from './category-button'; // Ensure this component is modified as described below.
import RangeSlider from './range-slider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import FilterIcon from '../../assets/filter-button.svg';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';

interface Category {
    id: string;
    name: string;
    metadata: {
        icon_url: string;
    };
}

type RangeType = [number, number];

const SideFilter = () => {
    const {
        selectedCategories,
        setSelectedCategories,
        range,
        setRange,
        setRangeUpper,
        setRangeLower,
    } = useUnifiedFilterStore();

    // Local state for the slider
    const [localRange, setLocalRange] = useState<RangeType>(range);
    useEffect(() => {
        setLocalRange(range);
    }, [range]);

    // Local state for category selections
    const [localSelectedCategories, setLocalSelectedCategories] = useState<string[]>(selectedCategories);
    useEffect(() => {
        setLocalSelectedCategories(selectedCategories);
    }, [selectedCategories]);

    // Fetching categories data
    const { data, isLoading } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/category/all`;
            const response = await axios.get(url);
            return response.data;
        },
    });

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
                maxWidth="145px"
                width="100%"
                borderRadius="full"
            />
        ));



    return (
        <Box
            display={{ base: 'none', md: 'block' }}
            p="1.5rem"
            color="white"
            borderRadius="20px"
            width="348.74px"
            backgroundColor="secondary.onyx.900"
        >
            <Heading as="h2" size="h2">
                Price Range
            </Heading>

            <Text mt="5px" color="secondary.davy.900">
                Prices before fees and taxes
            </Text>

            {/* Slider  */}
            <RangeSlider range={localRange} setRange={setLocalRange} />
            {/* Slider end */}

            {/* Categories */}
            <Box mt="2rem">
                <Heading as="h2" size="h2">
                    Category
                </Heading>

                <Flex mt="1rem" flexDirection="column" gap="16px">
                    {isLoading
                        ? skeletonButtons
                        : uniqueCategories.map((category, index) => (
                            <CategoryButton
                                key={index}
                                categoryName={category.name}
                                url={category.metadata?.icon_url}
                                selectedCategories={localSelectedCategories}
                                setSelectedCategories={setLocalSelectedCategories}
                            />
                        ))}
                </Flex>
            </Box>

            <Box mt="2rem">
                <Button
                    onClick={() => {
                        // Commit local category selections to global state.
                        if (
                            localSelectedCategories.length === 0 ||
                            (localSelectedCategories.length === 1 &&
                                localSelectedCategories[0].toLowerCase() === 'all')
                        ) {
                            setSelectedCategories(['all']);
                        } else {
                            setSelectedCategories(localSelectedCategories);
                        }
                        // Update global price range with the local slider state.
                        setRangeLower(localRange[0]);
                        setRangeUpper(localRange[1]);
                        setRange(localRange);

                        // Scroll to the top of the page
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                        });
                    }}
                    backgroundColor="secondary.onyx.900"
                    borderRadius="56px"
                    borderWidth="1px"
                    borderColor="white"
                    width="100%"
                    h="3.5rem"
                >
                    <Flex>
                        <Image
                            src={FilterIcon}
                            alt="Filter Button"
                            width={24}
                            height={24}
                        />
                        <Text ml="1rem" color="white" fontSize="18px">
                            Apply Filter
                        </Text>
                    </Flex>
                </Button>
            </Box>
        </Box>
    );
};

export default SideFilter;
