import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import useHomeProductsPage from '@store/home-page/product-layout/product-layout';
import Image from 'next/image';

interface CategoryButtonProps {
    categoryName: string;

    url: string;
}

const CategoryButtons: React.FC<CategoryButtonProps> = ({
    categoryName,

    url,
}) => {
    const { categorySelect, setCategorySelect } = useHomeProductsPage();

    const toggleCategorySelection = (category: string) => {
        const currentCategorySelection = categorySelect || [];

        // Check if the selected category is 'All'
        if (category === 'All') {
            return setCategorySelect(['All']);
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
    return (
        <Flex
            flexShrink={0}
            onClick={() => {
                toggleCategorySelection(categoryName);
            }}
            borderColor={'#3E3E3E'}
            backgroundColor={
                categorySelect?.includes(categoryName) ? 'white' : 'black'
            }
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            borderWidth={'1px'}
            borderRadius={'49px'}
            height={{ base: '42px', md: '63px' }}
            cursor="pointer"
            style={{ padding: '10px 24px' }}
            color={categorySelect?.includes(categoryName) ? 'black' : 'white'}
            transition="background 0.1s ease-in-out, color 0.1s ease-in-out"
            _hover={{
                color: 'black',
                background: 'white',
            }}
        >
            {url?.length && (
                <Image
                    src={url}
                    alt={categoryName}
                    width={20} // Set appropriate width
                    height={20} // Set appropriate height
                />
            )}

            <Text ml="10px" fontSize={{ base: '14px', md: '18px' }}>
                {categoryName}
            </Text>
        </Flex>
    );
};

export default CategoryButtons;
