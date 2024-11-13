import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import FilterTag from './filter-tag';
import { IoCloseOutline } from 'react-icons/io5';
import useProductGroup from '@/zustand/products/product-group/product-group';

const FilterTags = () => {
    const {
        categoryItem,
        setCategorySelect,
        setReviewStarsSelect,
        setCategoryItem,
    } = useProductGroup();

    const filterTags = () => {
        if (categoryItem && Array.isArray(categoryItem)) {
            return categoryItem.map((item, index) => (
                <FilterTag
                    key={`category-${index}`}
                    categoryName={item.categoryName}
                    categoryIconUrl={item.urlLink}
                />
            ));
        }
    };

    return (
        <Flex gap="20px">
            {filterTags()}
            <Flex
                height="63px"
                ml="auto"
                cursor={'pointer'}
                onClick={() => {
                    setCategorySelect(['All']);
                    setCategoryItem([]);
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
