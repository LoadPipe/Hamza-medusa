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
    Box,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import FilterIcon from '../../../../../../public/images/categories/mobile-filter.svg';
import Image from 'next/image';
import CategoryModalButton from './category-modal-button';
import useStorePage from '@store/store-page/store-page';
import useSideFilter from '@store/store-page/side-filter';
import useModalFilter from '@store/store-page/filter-modal';
import RangeSliderModal from './range-slider-modal';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useShopFilter from '@/store/store-page/shop-filter';

const USE_PRICE_FILTER: boolean = false;

// THIS IS THE SHOP PAGE NOT THE HOME PAGE
interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Category {
    id: string;
    name: string;
    metadata: {
        icon_url: string;
    };
}
type RangeType = [number, number];

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose }) => {
    // Zustand States
    const { setCategorySelect, setCategoryItem } = useStorePage();

    const {
        setSelectCategoryStoreFilter,
        setCategoryItemSideFilter,
        selectCategoryStoreFilter,
        categoryItemSideFilter,
        setPriceHi,
        setPriceLo,
        priceHi,
        priceLo,
    } = useShopFilter();

    const [range, setRange] = useState<RangeType>([0, 350]);

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

    const isDisabled = selectCategoryStoreFilter?.length === 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent mx="1rem" backgroundColor={'#121212'} boxShadow="lg">
                <ModalHeader
                    fontWeight={'600'}
                    fontSize={'16px'}
                    textAlign={'center'}
                    color="primary.green.900"
                >
                    Filters
                </ModalHeader>

                <ModalCloseButton color={'white'} />

                <RangeSliderModal range={range} setRange={setRange} />

                <ModalBody padding={'1rem'}>
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
                                    categoryName={category.name}
                                    url={category.metadata?.icon_url}
                                />
                            )
                        )}
                    </Flex>

                    {USE_PRICE_FILTER && (
                        <>
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

                            <RangeSliderModal
                                range={range}
                                setRange={setRange}
                            />
                        </>
                    )}

                    {/* <Text
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
                </ModalBody>

                <Divider mt="1.5rem" />

                <ModalFooter px={'1rem'} pt="1.4rem" pb="1.2rem">
                    <Button
                        fontSize={'16px'}
                        fontWeight={'400'}
                        justifyItems={'flex-start'}
                        color={'white'}
                        backgroundColor={'transparent'}
                        onClick={() => {
                            setSelectCategoryStoreFilter([]);
                            onClose();
                        }}
                        mr="auto"
                    >
                        Clear All
                    </Button>
                    <Button
                        isDisabled={isDisabled}
                        onClick={() => {
                            // Delete current settings
                            setCategorySelect([]);

                            // Update settings
                            if (
                                (selectCategoryStoreFilter?.length > 0 &&
                                    categoryItemSideFilter?.length > 0) ||
                                range.length > 0
                            ) {
                                console.log('range 0:', range[0]);
                                console.log('range 1:', range[1]);
                                setPriceLo(range[0]);
                                setPriceHi(range[1]);
                                console.log('price lo:', priceLo);
                                console.log('price hi:', priceHi);
                                setCategorySelect(selectCategoryStoreFilter);
                                setCategoryItem(categoryItemSideFilter);
                                // Reset side menu states
                                // setSelectCategoryStoreFilter([]);
                                setCategoryItemSideFilter([]);
                                setRange([range[0], range[1]]);
                            }

                            onClose();
                        }}
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

export default FilterModal;
