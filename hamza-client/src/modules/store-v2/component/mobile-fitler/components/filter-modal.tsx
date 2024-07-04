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
import React from 'react';
import FilterIcon from '../../../../../../public/images/categories/mobile-filter.svg';
import Image from 'next/image';
import CurrencyButton from '../../currency-button';
import currencies from '../../../data/currency-category';
import ReviewButton from '../../review-button';
import ReviewModalButton from './review-modal-button';
import RangeSliderComponent from '../../range-slider';
import CategoryModalButton from './category-modal-button';
import CurrencyModalButton from './currency-modal-button';
import useStorePage from '@store/store-page/store-page';
import useSideFilter from '@store/store-page/side-filter';
import useModalFilter from '@store/store-page/filter-modal';
import RangeSliderModal from './range-slider-modal';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose }) => {
    const {
        setCurrencySelect,
        setReviewStarsSelect,
        setCategorySelect,
        setCategoryTypeSelect,
    } = useStorePage();
    const {
        categoryFilterSelect,
        categoryTypeFilterSelect,
        reviewFilterSelect,
        currencyFilterSelect,
        setReviewFilterSelect,
        setCurrencyFilterSelect,
        setCategoryFilterSelect,
        setCategoryTypeFilterSelect,
    } = useSideFilter();

    const {
        modalCurrencyFilterSelect,
        modalCategoryFilterSelect,
        modalCategoryTypeFilterSelect,
        setModalCategoryTypeFilterSelect,
        setModalCurrencyFilterSelect,
        setModalCategoryFilterSelect,
    } = useModalFilter();

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
                        Categories
                    </Text>
                    <Flex
                        mt="1.5rem"
                        flexDirection={'row'}
                        wrap={'wrap'}
                        gap="16px"
                    >
                        <CategoryModalButton
                            categoryType="home_light"
                            categoryName="All"
                        />
                        <CategoryModalButton
                            categoryType="home_light"
                            categoryName="Legendary Light Design"
                        />
                        <CategoryModalButton
                            categoryType="gadgets"
                            categoryName="Dauntless"
                        />
                        <CategoryModalButton
                            categoryType="clothes"
                            categoryName="Medusa Merch"
                        />
                        <CategoryModalButton
                            categoryType="games"
                            categoryName="Drones"
                        />
                        <CategoryModalButton
                            categoryType="games"
                            categoryName="Legos"
                        />
                        <CategoryModalButton
                            categoryType="board_games"
                            categoryName="Board Games"
                        />
                        <CategoryModalButton
                            categoryType="workout_gear"
                            categoryName="Workout Gear"
                        />
                        <CategoryModalButton
                            categoryType="games"
                            categoryName="Echo Rift"
                        />
                        <CategoryModalButton
                            categoryType="games"
                            categoryName="Gaming Gear"
                        />
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

                    <RangeSliderModal />

                    <Text
                        mt="2rem"
                        fontWeight={'600'}
                        fontSize={'16px'}
                        color="white"
                    >
                        Cryptocurrency
                    </Text>
                    <Text
                        // mx={'1.5rem'}
                        mt="0.25rem"
                        fontSize={'14px'}
                        color="secondary.davy.900"
                    >
                        Pay with different cryptocurrencies
                    </Text>

                    <Flex mt="1.5rem" flexDirection={'row'} gap="12px">
                        {Object.keys(currencies).map((key) => (
                            <CurrencyModalButton
                                key={key}
                                currencyName={
                                    (currencies as { [key: string]: any })[key]
                                }
                            />
                        ))}
                    </Flex>
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
                    </Flex>
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
                            setReviewFilterSelect(null);
                            setCurrencyFilterSelect(null);
                            setCategoryFilterSelect(null);
                            setCategoryTypeFilterSelect(null);
                            onClose();
                        }}
                        mr="auto"
                    >
                        Clear All
                    </Button>
                    <Button
                        onClick={() => {
                            if (modalCurrencyFilterSelect) {
                                setCurrencySelect(modalCurrencyFilterSelect);
                            }
                            if (reviewFilterSelect) {
                                setReviewStarsSelect(reviewFilterSelect);
                            }
                            if (modalCategoryFilterSelect) {
                                setCategorySelect(modalCategoryFilterSelect);
                                setCategoryTypeSelect(
                                    modalCategoryTypeFilterSelect
                                );
                            }
                            setModalCurrencyFilterSelect(null);
                            setModalCategoryFilterSelect(null);
                            setModalCategoryTypeFilterSelect(null);
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
