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
import FilterIcon from '../../../../../../../../public/images/categories/mobile-filter.svg';
import Image from 'next/image';
import CategoryButtonModal from '@/modules/products/components/buttons/category-button-modal';
import RangeSliderModal from '@modules/shop/components/mobile-filter-modal/components/range-slider-modal';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';

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
        selectedCategories,
        setSelectedCategories,
        range: globalRange,
        setRange,
        setRangeUpper,
        setRangeLower,
    } = useUnifiedFilterStore();

    const [modalSelectedCategories, setModalSelectedCategories] = useState<string[]>(selectedCategories);
    const [modalRange, setModalRange] = useState<RangeType>(globalRange);

    useEffect(() => {
        if (isOpen) {
            setModalSelectedCategories(selectedCategories);
            setModalRange(globalRange);
        }
    }, [isOpen, selectedCategories, globalRange]);

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

    const isDisabled =
        modalSelectedCategories.length === 0 &&
        modalRange[0] === 0 &&
        modalRange[1] === 350;

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
                className="filter-modal"
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
                            <CategoryButtonModal
                                key={index}
                                categoryName={category.name}
                                url={category.metadata?.icon_url}
                            />
                            ),
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

                    <RangeSliderModal range={modalRange} setRange={setModalRange} />

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
                            // Clear all filters: reset modal and global state to default
                            setModalSelectedCategories(['all']);
                            setSelectedCategories(['all']);
                            setRange([0, 350]);
                            setRangeUpper(350);
                            setRangeLower(0);
                            onClose();
                        }}
                    >
                        Clear All
                    </Button>
                    <Button
                        isDisabled={isDisabled}
                        onClick={() => {
                            // If no category is selected, default to "all"
                            if (modalSelectedCategories.length === 0) {
                                setSelectedCategories(['all']);
                            } else {
                                setSelectedCategories(modalSelectedCategories);
                            }
                            // Update global price range.
                            setRange(modalRange);
                            setRangeLower(modalRange[0]);
                            setRangeUpper(modalRange[1]);
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
