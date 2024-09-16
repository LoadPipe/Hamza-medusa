import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import useModalFilter from '@store/store-page/filter-modal';
import useHomeModalFilter from '@store/home-page/home-filter/home-filter';
import categoryIcons from '@modules/shop/data/category-icons';
interface CategoryButtonProps {
    categoryName: string; // Single category name per button
    categoryType: string; // Single category type per button
    url: string;
}

const CategoryModalButton: React.FC<CategoryButtonProps> = ({
    categoryName,
    categoryType,
    url,
}) => {
    const {
        homeModalCategoryFilterSelect,
        homeModalCategoryTypeFilterSelect,
        setHomeModalCategoryFilterSelect,
        setHomeModalCategoryTypeFilterSelect,
    } = useHomeModalFilter();

    const toggleCategorySelection = (category: string, type: string) => {
        const currentCategorySelection = homeModalCategoryFilterSelect || [];
        const currentTypeSelection = homeModalCategoryTypeFilterSelect || [];

        // If the category is already selected, we remove it along with its type
        if (currentCategorySelection.includes(category)) {
            const updatedCategorySelection = currentCategorySelection.filter(
                (selectedCategory) => selectedCategory !== category
            );
            const updatedTypeSelection = currentTypeSelection.filter(
                (selectedType) => selectedType !== type
            );
            setHomeModalCategoryFilterSelect(
                updatedCategorySelection.length
                    ? updatedCategorySelection
                    : ['All']
            );
            setHomeModalCategoryTypeFilterSelect(
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
            setHomeModalCategoryFilterSelect([
                ...updatedCategorySelection,
                category,
            ]);
            setHomeModalCategoryTypeFilterSelect([
                ...updatedTypeSelection,
                type,
            ]);
        }
    };

    return (
        <Flex>
            <Flex
                borderColor={'secondary.davy.900'}
                backgroundColor={
                    homeModalCategoryFilterSelect?.includes(categoryName)
                        ? 'white'
                        : 'transparent'
                }
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                borderWidth={'1px'}
                borderRadius={'49px'}
                height={'42px'}
                cursor="pointer"
                color={
                    homeModalCategoryFilterSelect?.includes(categoryName)
                        ? 'black'
                        : 'white'
                }
                padding="10px 24px"
                transition="background 0.1s ease-in-out, color 0.1s ease-in-out"
                _hover={{
                    background: 'white',
                    color: 'black',
                }}
                onClick={() =>
                    toggleCategorySelection(categoryName, categoryType)
                }
            >
                <Image src={url} alt={categoryName} width={18} height={18} />

                <Text ml="10px" fontSize={{ base: '14px', md: '16px' }}>
                    {categoryName}
                </Text>
            </Flex>
        </Flex>
    );
};

export default CategoryModalButton;
