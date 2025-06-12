import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import FilterTag from './filter-tag';
import { IoCloseOutline } from 'react-icons/io5';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';

const FilterTags = () => {
    const {
        selectedCategories,
        setSelectedCategories,
        setRange,
        setRangeUpper,
        setRangeLower,
    } = useUnifiedFilterStore();

    const filterTags = () => {
        if (selectedCategories && Array.isArray(selectedCategories) && !selectedCategories.includes('all')) {
            return selectedCategories.map((categoryId, index) => (
                <FilterTag
                    key={`category-${index}`}
                    categoryName={categoryId}
                    categoryIconUrl={''}
                />
            ));
        }
        return null;
    };

    const handleClearAll = () => {
        setSelectedCategories(['all']);
        setRange([0, 350]);
        setRangeUpper(350);
        setRangeLower(0);
    };

    return (
        <Flex gap="20px">
            {filterTags()}
            <Flex
                height="63px"
                ml="auto"
                cursor={'pointer'}
                onClick={handleClearAll}
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
