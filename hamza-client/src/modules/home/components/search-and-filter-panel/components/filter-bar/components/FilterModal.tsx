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
import FilterIcon from '../../../../../../../../public/images/categories/mobile-filter.svg';
import Image from 'next/image';
import currencies from '../data/currency-icons';
import ReviewModalButton from './ReviewModalButton';
import CategoryModalButton from './CategoryModalButton';
import CurrencyModalButton from './CurrencyModalButton';
import useStorePage from '@store/store-page/store-page';
import useSideFilter from '@store/store-page/side-filter';
import useModalFilter from '@store/store-page/filter-modal';
import useHomeProductsPage from '@store/home-page/product-layout/product-layout';
import useHomeModalFilter from '@store/home-page/home-filter/home-filter';
import RangeSliderModal from '@modules/store-v2/component/mobile-fitler/components/range-slider-modal';
import vendors from '../../../data/data';
interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FilterModalHome: React.FC<FilterModalProps> = ({ isOpen, onClose }) => {
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
        setHomeModalCategoryTypeFilterSelect,
        setHomeModalCurrencyFilterSelect,
        setHomeModalCategoryFilterSelect,
    } = useHomeModalFilter();

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
                <ModalBody maxW={'771px'} padding={'1rem'} mx="auto">
                    <Text fontWeight={'600'} fontSize={'16px'} color="white">
                        Vendors
                    </Text>
                    <Flex
                        mt="1.5rem"
                        flexDirection={'row'}
                        wrap={'wrap'}
                        gap="16px"
                    >
                        {vendors.map((vendor: any, index) => (
                            <CategoryModalButton
                                key={index}
                                categoryType="clothes"
                                categoryName={vendor.vendorName}
                            />
                        ))}
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
                    <Divider mt="2rem" opacity={'0.5'} />
                </ModalBody>

                <ModalFooter
                    maxW={'771px'}
                    width={'100%'}
                    mx="auto"
                    px={'1rem'}
                    pb="2.5rem"
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
                                );
                                setCategoryTypeSelect(
                                    homeModalCategoryTypeFilterSelect
                                );
                            }
                            setHomeModalCurrencyFilterSelect(null);
                            setHomeModalCategoryFilterSelect(null);
                            setHomeModalCategoryTypeFilterSelect(null);
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

export default FilterModalHome;
