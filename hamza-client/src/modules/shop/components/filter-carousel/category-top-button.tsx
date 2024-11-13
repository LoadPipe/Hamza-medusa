import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import useStorePage from '@/zustand/store-page/store-page';
import categoryIcons from '../../data/category-icons';
import Image from 'next/image';

interface CategoryButtonProps {
    categoryName: string;
    url: string;
}

const CategoryTopButton: React.FC<CategoryButtonProps> = ({
    categoryName,
    url,
}) => {
    const { categorySelect, setCategorySelect, setCategoryItem } =
        useStorePage();

    const toggleCategorySelection = (category: string) => {
        const currentCategorySelection = categorySelect || [];

        // Check if the selected category is 'All'
        if (category === 'All') {
            // Reset category selection to only include 'All'
            setCategorySelect(['All']);
            // Reset category items to an empty array
            setCategoryItem([]);
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

            setCategoryItem(
                (prev) =>
                    prev?.filter((item) => item.categoryName !== category) ||
                    null
            );
        } else {
            // If the category is not selected we add it to the array
            const updatedCategorySelection = currentCategorySelection.filter(
                (cat) => cat !== 'All'
            );
            setCategorySelect([...updatedCategorySelection, category]);

            setCategoryItem((prev) => [
                ...(prev || []),
                { categoryName: category, urlLink: url },
            ]);
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
                categorySelect?.includes(categoryName) ? 'white' : 'transparent'
            }
            display={'flex'}
            flexDirection={'row'}
            alignItems={'center'}
            borderWidth={'1px'}
            borderRadius={'49px'}
            height={'63px'}
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
                <Image src={url} alt={categoryName} width={20} height={20} />
            )}
            <Text ml="10px" fontSize={'18px'}>
                {categoryName}
            </Text>
        </Flex>
    );
};

export default CategoryTopButton;
