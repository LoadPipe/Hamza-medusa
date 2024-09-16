import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import useStorePage from '@store/store-page/store-page';
import FilterTag from './filter-tag';
import { IoCloseOutline } from 'react-icons/io5';
import categoryIcons from '../../data/category-icons';

const FilterTags = () => {
    const { categoryItem, setCategorySelect, setReviewStarsSelect } =
        useStorePage();

    console.log('filter tags', categoryItem);

    const filterTags = () => {
        if (categoryItem && Array.isArray(categoryItem)) {
            return categoryItem.map((item, index) => (
                <FilterTag
                    url={item.urlLink} // Use the icon based on the category name
                    key={`category-${index}`} // Unique key for each category tag
                    name={item.categoryName} // Display category name
                />
            ));
        }

        // If no category items exist, display "No filters applied"
        return (
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
                    setCategorySelect(['All']);
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
