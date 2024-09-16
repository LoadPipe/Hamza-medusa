import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import useStorePage from '@store/store-page/store-page';
import categoryIcons from '../data/category-icons';
import Image from 'next/image';

interface CategoryButtonProps {
    categoryName: string;
    categoryType: string;
    url: string;
}

const CategoryTopButton: React.FC<CategoryButtonProps> = ({
    categoryName,
    categoryType,
    url,
}) => {
    const {
        categorySelect,
        categoryTypeSelect,
        setCategorySelect,
        setCategoryTypeSelect,
    } = useStorePage();

    const toggleCategorySelection = (category: string, type: string) => {
        const currentCategorySelection = categorySelect || [];
        const currentTypeSelection = categoryTypeSelect || [];

        // If the category is already selected, we remove it along with its type
        if (currentCategorySelection.includes(category)) {
            const updatedCategorySelection = currentCategorySelection.filter(
                (selectedCategory) => selectedCategory !== category
            );
            const updatedTypeSelection = currentTypeSelection.filter(
                (selectedType) => selectedType !== type
            );
            setCategorySelect(
                updatedCategorySelection.length
                    ? updatedCategorySelection
                    : ['All']
            );
            setCategoryTypeSelect(
                updatedTypeSelection.length ? updatedTypeSelection : ['All']
            );
        } else {
            // If the category is not selected, we add both the category and type
            const updatedCategorySelection = currentCategorySelection.filter(
                (cat) => cat !== 'All'
            );
            const updatedTypeSelection = currentTypeSelection.filter(
                (catType) => catType !== 'All'
            );
            setCategorySelect([...updatedCategorySelection, category]);
            setCategoryTypeSelect([...updatedTypeSelection, type]);
        }
    };

    return (
        <Flex
            flexShrink={0}
            onClick={() => {
                toggleCategorySelection(categoryName, categoryType);
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
