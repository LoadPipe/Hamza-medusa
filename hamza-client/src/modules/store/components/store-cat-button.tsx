import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import useVendor from '@/zustand/store-page/vendor';

type StoreCatButtonProps = {
    categoryName: string;
};

const StoreCatButton: React.FC<StoreCatButtonProps> = ({ categoryName }) => {
    const { categorySelect, setCategorySelect } = useVendor();

    const toggleCategorySelection = (category: string) => {
        const currentCategorySelection = categorySelect || [];

        // Check if the selected category is 'All'
        if (category === 'All') {
            // Reset category selection to only include 'All'
            setCategorySelect(['All']);
            // Reset category items to an empty array

            return; // Exit the function to prevent further logic
        }
        // If the category is already selected, we remove it along with its type
        if (currentCategorySelection.includes(category)) {
            const updatedCategorySelection = currentCategorySelection.filter(
                (selectedCategory) => selectedCategory !== category
            );

            setCategorySelect(
                updatedCategorySelection.length > 0
                    ? updatedCategorySelection
                    : ['All']
            );
        } else {
            // If the category is not selected we add it to the array
            const updatedCategorySelection = currentCategorySelection.filter(
                (cat) => cat !== 'All'
            );
            setCategorySelect([...updatedCategorySelection, category]);
        }
    };

    const formattedCatName = categoryName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

    return (
        <Flex
            px={'1rem'}
            minWidth={{ base: '94px', md: '167px' }}
            height={{ base: '42px', md: '66px' }}
            borderRadius={'49px'}
            borderWidth={'1px'}
            backgroundColor={
                categorySelect?.includes(categoryName) ? 'white' : 'transparent'
            }
            color={categorySelect?.includes(categoryName) ? 'black' : 'white'}
            justifyContent={'center'}
            alignItems={'center'}
            cursor={'pointer'}
            onClick={() => {
                toggleCategorySelection(categoryName);
            }}
        >
            <Text fontSize={{ base: '10px', md: '16px' }}>
                {formattedCatName}
            </Text>
        </Flex>
    );
};

export default StoreCatButton;
