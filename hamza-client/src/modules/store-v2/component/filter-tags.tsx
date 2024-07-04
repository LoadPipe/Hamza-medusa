import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import useStorePage from '@store/store-page/store-page';
import FilterTag from './filter-tag';
import ReviewStar from '../../../../public/images/products/review-star.svg';
import { IoCloseOutline } from 'react-icons/io5';
import categoryIcons from '../data/category-icons';
import currencyIcons from '../data/crypto-currencies';

const FilterTags = () => {
    const {
        categorySelect,
        currencySelect,
        categoryTypeSelect,
        reviewStarsSelect,
        setCategorySelect,
        setCurrencySelect,
        setReviewStarsSelect,
        setCategoryTypeSelect,
    } = useStorePage();

    const filterTags = () => {
        const tags = [];
        if (categorySelect) {
            tags.push(
                <FilterTag
                    img={
                        categoryTypeSelect
                            ? categoryIcons[categoryTypeSelect]
                            : ''
                    }
                    key="category"
                    name={`${categorySelect}`}
                />
            );
        }
        if (currencySelect) {
            const currencyIcon = currencyIcons[currencySelect];
            tags.push(
                <FilterTag
                    img={currencyIcon}
                    key="currency"
                    name={`${currencySelect}`}
                />
            );
        }
        if (reviewStarsSelect) {
            // Check for non-null explicitly for numbers
            tags.push(
                <FilterTag
                    img={
                        categoryTypeSelect
                            ? categoryIcons[categoryTypeSelect]
                            : ''
                    }
                    key="category"
                    name={`${categorySelect}`}
                />
            );
        }
        return tags.length > 0 ? (
            tags
        ) : (
            // <FilterTag img={categoryIcons['all']} key="category" name={`All`} />

            <Text alignSelf={'center'} color={'primary.green.900'}>
                No filters applied.
            </Text>
        );
    };

    return (
        <Flex gap="20px">
            {filterTags()}
            <Flex
                height="63px"
                ml="auto"
                cursor={'pointer'}
                onClick={() => {
                    setCategorySelect('All');
                    setCategoryTypeSelect('all');
                    setCurrencySelect(null);
                    setReviewStarsSelect(null);
                }}
                color="white"
                _hover={{
                    color: 'primary.green.900',
                }}
            >
                <Text fontSize="16px" alignSelf={'center'}>
                    Clear All
                </Text>
                <Flex>
                    <IoCloseOutline
                        size={19}
                        style={{ alignSelf: 'center', marginLeft: '5px' }}
                    />
                </Flex>
            </Flex>
        </Flex>
    );
};

export default FilterTags;
