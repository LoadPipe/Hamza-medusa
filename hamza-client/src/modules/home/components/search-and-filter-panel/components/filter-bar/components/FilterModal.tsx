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
import RangeSliderModal from '@modules/shop/components/mobile-filter-modal/components/range-slider-modal';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import useProductGroup from '@/zustand/products/product-group/product-group';
import useProductFilterModal from '@/zustand/products/filter-modal/product-filter-modal';
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
    const { setCategorySelect } = useProductGroup();

    const {
        setSelectCategoryFilter,
        selectCategoryFilter,
        setRangeUpper,
        setRangeLower,
    } = useProductFilterModal();

    // Fetching categories data
    const { data, isLoading } = useQuery<Category[]>(
        ['categories'],
        async () => {
            const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/category/all`;
            const response = await axios.get(url);
            return response.data;
        }
    );

    const [range, setRange] = useState<RangeType>([0, 350]);

    // Extract unique category names with id
    const uniqueCategories: Category[] = data
        ? data.map((category) => ({
              name: category.name,
              id: category.id,
              metadata: category.metadata,
          }))
        : [];

    const isDisabled =
        selectCategoryFilter.length === 0 && range[0] === 0 && range[1] === 350;

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
                                    categoryName={category.name}
                                    url={category.metadata?.icon_url}
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

                    <RangeSliderModal range={range} setRange={setRange} />

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
                            setSelectCategoryFilter([]);
                            setCategorySelect(['All']);
                            setRange([0, 350]);
                            setRangeUpper(350), setRangeLower(0), onClose();
                        }}
                    >
                        Clear All
                    </Button>
                    <Button
                        isDisabled={isDisabled}
                        onClick={() => {
                            // If no category is selected, set default to "All"
                            if (selectCategoryFilter.length === 0) {
                                setCategorySelect(['All']);
                            } else {
                                setCategorySelect(selectCategoryFilter);
                            }

                            // Update range settings if modified
                            if (range[0] !== 0 || range[1] !== 350) {
                                setRangeLower(range[0]);
                                setRangeUpper(range[1]);
                            }

                            // Update range
                            setRange([range[0], range[1]]);

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
