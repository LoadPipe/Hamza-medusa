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
import React, { useEffect, useState } from 'react';
import FilterIcon from '../../../../../../public/images/categories/mobile-filter.svg';
import Image from 'next/image';
import CategoryButtonModal from '@/modules/products/components/buttons/category-button-modal';
import RangeSliderModal from './range-slider-modal';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useUnifiedFilterStore, {
    FILTER_PRICE_RANGE_MAX,
    FILTER_PRICE_RANGE_MIN,
} from '@/zustand/products/filter/use-unified-filter-store';

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
    const {
        selectedCategories,
        setSelectedCategories,
        range,
        setRange,
        setRangeUpper,
        setRangeLower,
    } = useUnifiedFilterStore();

    const [modalSelectedCategories, setModalSelectedCategories] =
        useState<string[]>(selectedCategories);
    const [localRange, setLocalRange] = useState<RangeType>(range);

    useEffect(() => {
        if (isOpen) {
            setModalSelectedCategories(selectedCategories);
            setLocalRange(range);
        }
    }, [isOpen, selectedCategories, range]);

    useEffect(() => {
        setLocalRange(range);
    }, [range]);

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
                                <CategoryButtonModal
                                    key={index}
                                    categoryName={category.name}
                                    url={category.metadata?.icon_url}
                                    selectedCategories={modalSelectedCategories}
                                    setSelectedCategories={
                                        setModalSelectedCategories
                                    }
                                />
                            )
                        )}
                    </Flex>

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
                            setSelectedCategories(['all']);
                            setLocalRange([
                                FILTER_PRICE_RANGE_MIN,
                                FILTER_PRICE_RANGE_MAX,
                            ]);
                            setRange([
                                FILTER_PRICE_RANGE_MIN,
                                FILTER_PRICE_RANGE_MAX,
                            ]);
                            setRangeUpper(FILTER_PRICE_RANGE_MAX);
                            setRangeLower(0);
                            onClose();
                        }}
                        mr="auto"
                    >
                        Clear All
                    </Button>
                    <Button
                        onClick={() => {
                            if (modalSelectedCategories.length === 0) {
                                setSelectedCategories(['all']);
                            } else {
                                setSelectedCategories(modalSelectedCategories);
                            }
                            if (
                                localRange[0] !== 0 ||
                                localRange[1] !== FILTER_PRICE_RANGE_MAX
                            ) {
                                setRangeLower(localRange[0]);
                                setRangeUpper(localRange[1]);
                            }
                            setRange(localRange);
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
