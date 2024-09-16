import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Flex,
    Divider,
    Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import FilterIcon from '../../../../../../../../public/images/categories/mobile-filter.svg';
import Image from 'next/image';
import CategoryModalButton from './CategoryModalButton';
import useSideFilter from '@store/store-page/side-filter';
import useHomeProductsPage from '@store/home-page/product-layout/product-layout';
import useHomeModalFilter from '@store/home-page/home-filter/home-filter';
import RangeSliderModal from '@modules/shop/components/mobile-filter/components/range-slider-modal';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Array<{ name: string; id: string }>; // Add categories prop with array of category objects
}

interface Category {
    id: string;
    name: string;
    metadata: {
        icon_url: string;
    };
}

const USE_PRICE_FILTER: boolean = false;

type RangeType = [number, number];

const FilterModalHome: React.FC<FilterModalProps> = ({
    isOpen,
    onClose,
    categories,
}) => {
    const {
        setCurrencySelect,
        setReviewStarsSelect,
        setCategorySelect,
        setCategoryTypeSelect,
    } = useHomeProductsPage();
    const {
        reviewFilterSelect,
        setReviewFilterSelect,
        setCurrencyFilterSelect,
        setCategoryFilterSelect,
        setCategoryTypeFilterSelect,
    } = useSideFilter();

    const {
        homeModalCurrencyFilterSelect,
        homeModalCategoryFilterSelect,
        homeModalCategoryTypeFilterSelect,
        homeModalLowerPriceFilterSelect,
        homeModalUpperPriceFilterSelect,
        setHomeModalCategoryTypeFilterSelect,
        setHomeModalCurrencyFilterSelect,
        setHomeModalCategoryFilterSelect,
        setHomeModalLowerPriceFilterSelect,
        setHomeModalUpperPriceFilterSelect,
    } = useHomeModalFilter();

    // Fetching categories data
    const { data, isLoading } = useQuery<Category[]>(
        ['categories'],
        async () => {
            const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/category/all`;
            const response = await axios.get(url);
            return response.data;
        }
    );

    const [range, setRange] = useState<RangeType>([0, 10000]);

    console.log(
        `what value is ${homeModalLowerPriceFilterSelect} and ${homeModalUpperPriceFilterSelect}`
    );

    // Extract unique category names with id
    const uniqueCategories: Category[] = data
        ? data.map((category) => ({
            name: category.name,
            id: category.id,
            metadata: category.metadata,
        }))
        : [];

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
                mx="1rem"
                maxWidth={'884px'}
                width={'100%'}
                backgroundColor={'#121212'}
                borderRadius={'12px'}
                boxShadow="lg"
            >
                <ModalHeader
                    fontWeight={'600'}
                    fontSize={'24px'}
                    textAlign={'center'}
                    color="primary.green.900"
                >
                    Filters
                </ModalHeader>
                <ModalCloseButton color={'white'} />
                <ModalBody maxW={'771px'} width="100%" mx="auto">
                    <Text fontWeight={'600'} fontSize={'16px'} color="white">
                        Category
                    </Text>
                    <Flex
                        mt="1.5rem"
                        flexDirection={'row'}
                        wrap={'wrap'}
                        gap="16px"
                    >
                        {uniqueCategories.map(
                            (category: any, index: number) => (
                                <CategoryModalButton
                                    key={index}
                                    categoryType={category.id}
                                    categoryName={category.name}
                                    url={category.metadata?.icon_url}
                                />
                            )
                        )}
                    </Flex>
                    {USE_PRICE_FILTER && <>
                        <Text
                            mt="1.5rem"
                            fontWeight={'600'}
                            fontSize={'16px'}
                            color="white"
                        >
                            Price Range
                        </Text>

                        <Text
                            mt="0.25rem"
                            fontSize={'14px'}
                            color="secondary.davy.900"
                        >
                            Prices before fees and taxes
                        </Text>

                        <RangeSliderModal range={range} setRange={setRange} />
                    </>}
                    {/* 
                    <Text
                        my="1.5rem"
                        fontWeight={'600'}
                        fontSize={'16px'}
                        color="white"
                    >
                        Ratings
                    </Text>

                    <Flex
                        mt="0.5rem"
                        flexDirection={'row'}
                        wrap={'wrap'}
                        gap="12px"
                    >
                        <ReviewModalButton title={'All'} value={'All'} />
                        <ReviewModalButton title={'4 Stars'} value={'4'} />
                        <ReviewModalButton title={'3 Stars'} value={'3'} />
                        <ReviewModalButton title={'2 Stars'} value={'2'} />
                        <ReviewModalButton title={'1 Star'} value={'1'} />
                    </Flex> */}
                    <Divider
                        mt="2rem"
                        opacity={'0.5'}
                        borderColor={'#3E3E3E'}
                    />
                </ModalBody>

                <ModalFooter
                    maxW={'771px'}
                    width={'100%'}
                    pb="2.5rem"
                    mx="auto"
                >
                    <Button
                        fontSize={'16px'}
                        fontWeight={'400'}
                        mr="auto"
                        color={'white'}
                        backgroundColor={'transparent'}
                        onClick={() => {
                            setHomeModalCategoryTypeFilterSelect(null),
                                setHomeModalCurrencyFilterSelect(null),
                                setHomeModalCategoryFilterSelect(null);
                        }}
                    >
                        Clear All
                    </Button>
                    <Button
                        onClick={() => {
                            if (homeModalCurrencyFilterSelect) {
                                setCurrencySelect(
                                    homeModalCurrencyFilterSelect
                                );
                            }
                            if (reviewFilterSelect) {
                                setReviewStarsSelect(reviewFilterSelect);
                            }
                            if (homeModalCategoryFilterSelect) {
                                setCategorySelect(
                                    homeModalCategoryFilterSelect
                                ); // Array of categories
                                // setCategoryTypeSelect(
                                //     homeModalCategoryTypeFilterSelect
                                // );
                            }
                            setHomeModalCurrencyFilterSelect(null);
                            setHomeModalCategoryFilterSelect(null);
                            setHomeModalCategoryTypeFilterSelect(null);
                            setHomeModalLowerPriceFilterSelect(range[0]);
                            setHomeModalUpperPriceFilterSelect(range[1]);
                            onClose();
                        }}
                        ml="auto"
                        fontSize={'16px'}
                        fontWeight={'400'}
                        leftIcon={
                            <Image
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    alignSelf: 'center',
                                }}
                                src={FilterIcon}
                                alt="mobile filter"
                            />
                        }
                        backgroundColor={'primary.indigo.900'}
                        width={'100%'}
                        maxW={'155px'}
                        variant="ghost"
                        color="white"
                        borderRadius={'full'}
                    >
                        Apply Filters
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default FilterModalHome;
