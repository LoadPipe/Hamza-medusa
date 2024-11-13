import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import useShopFilter from '@/zustand/products/shop-filter/shop-filter';

interface CategoryButtonProps {
    categoryName: string;
    url: string;
}

const CategoryModalButton: React.FC<CategoryButtonProps> = ({
    categoryName,

    url,
}) => {
    const {
        selectCategoryFilter,
        setSelectCategoryFilter,
        setCategoryItemFilter,
    } = useShopFilter();

    const toggleCategorySelection = (category: string) => {
        const currentCategorySelection = selectCategoryFilter || [];

        // If the category is already selected, we remove it along with its type
        if (currentCategorySelection.includes(category)) {
            const updatedCategorySelection = currentCategorySelection.filter(
                (selectedCategory) => selectedCategory !== category
            );

            setSelectCategoryFilter(
                updatedCategorySelection.length ? updatedCategorySelection : []
            );

            setCategoryItemFilter(
                (prev) =>
                    prev?.filter((item) => item.categoryName !== category) ||
                    null
            );
        } else {
            // If the category is not selected, we add both the category and type
            const updatedCategorySelection = currentCategorySelection.filter(
                (cat) => cat !== 'All'
            );

            setSelectCategoryFilter([...updatedCategorySelection, category]);

            setCategoryItemFilter((prev) => [
                ...(prev || []),
                { categoryName: category, urlLink: url },
            ]);
        }
    };

    return (
        <Flex>
            <Flex
                borderColor={'secondary.davy.900'}
                backgroundColor={
                    selectCategoryFilter?.includes(categoryName)
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
                    selectCategoryFilter?.includes(categoryName)
                        ? 'black'
                        : 'white'
                }
                padding="10px 24px"
                transition="background 0.1s ease-in-out, color 0.1s ease-in-out"
                onClick={() => toggleCategorySelection(categoryName)}
            >
                {url?.length && (
                    <Image
                        src={url}
                        alt={categoryName}
                        width={18}
                        height={18}
                    />
                )}
                <Text ml="10px" fontSize={{ base: '14px', md: '16px' }}>
                    {categoryName}
                </Text>
            </Flex>
        </Flex>
    );
};

export default CategoryModalButton;
