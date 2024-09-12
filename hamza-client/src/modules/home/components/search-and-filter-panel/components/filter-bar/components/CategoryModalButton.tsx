import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import useModalFilter from '@store/store-page/filter-modal';
import useHomeModalFilter from '@store/home-page/home-filter/home-filter';
import categoryIcons from '@modules/shop/data/category-icons';
interface CategoryButtonProps {
    categoryName: string[];
    categoryType: string[];
}

const CategoryModalButton: React.FC<CategoryButtonProps> = ({
    categoryName,
    categoryType,
}) => {
    const {
        homeModalCategoryFilterSelect,
        setHomeModalCategoryFilterSelect,
        setHomeModalCategoryTypeFilterSelect,
    } = useHomeModalFilter();

    const toggleCategorySelection = (category: string) => {
        if (homeModalCategoryFilterSelect?.includes(category)) {
            // If the category is already selected, remove it
            const updatedSelection = homeModalCategoryFilterSelect.filter(
                (selected) => selected !== category
            );
            setHomeModalCategoryFilterSelect(updatedSelection);
        } else {
            // If the category is not selected, add it
            setHomeModalCategoryFilterSelect([
                ...(homeModalCategoryFilterSelect || []),
                category,
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
                    homeModalCategoryFilterSelect === categoryName
                        ? 'black'
                        : 'white'
                }
                padding="10px 24px"
                transition="background 0.1s ease-in-out, color 0.1s ease-in-out"
                _hover={{
                    background: 'white',
                    color: 'black',
                }}
                onClick={() => toggleCategorySelection(categoryName)}
            >
                <Image
                    src={categoryIcons[categoryName[0]?.toLowerCase()]}
                    alt={categoryName[0]}
                />

                <Text ml="10px" fontSize={{ base: '14px', md: '16px' }}>
                    {categoryName}
                </Text>
            </Flex>
        </Flex>
    );
};

export default CategoryModalButton;
