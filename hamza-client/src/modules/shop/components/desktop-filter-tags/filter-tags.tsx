import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import useStorePage from '@store/store-page/store-page';
import FilterTag from './filter-tag';
import { IoCloseOutline } from 'react-icons/io5';
import categoryIcons from '../../data/category-icons';

const FilterTags = () => {
    const { categorySelect, setCategorySelect, setReviewStarsSelect } =
        useStorePage();

    const filterTags = () => {
        const tags = [];

        // Iterate through categorySelect if it's an array
        if (categorySelect && Array.isArray(categorySelect)) {
            categorySelect.forEach((category, index) => {
                tags.push(
                    <FilterTag
                        img={categoryIcons[category] || ''} // Check if icon exists for the category
                        key={`category-${index}`} // Unique key for each category tag
                        name={`${category}`} // Category name
                    />
                );
            });
        }

        // If there are no tags, display the "No filters applied" text
        return tags.length > 0 ? (
            tags
        ) : (
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
