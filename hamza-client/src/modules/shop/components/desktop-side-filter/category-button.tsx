import React, { useEffect } from 'react';
import { Text, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import useSideFilter from '@store/store-page/side-filter';
import useModalFilter from '@store/store-page/filter-modal';
import categoryIcons from '../../data/category-icons';
import useShopFilter from '@/store/store-page/shop-filter';

interface CategoryButtonProps {
    categoryName: string;
    url: string;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
    categoryName,
    url,
}) => {
    const {
        selectCategoryShopFilter,
        setSelectCategoryShopFilter,
        setCategoryItemShopFilter,
    } = useShopFilter();

    const toggleCategorySelection = (category: string) => {
        const currentCategorySelection = selectCategoryShopFilter || [];

        // If the category is already selected, we remove it along with its type
        if (currentCategorySelection.includes(category)) {
            const updatedCategorySelection = currentCategorySelection.filter(
                (selectedCategory) => selectedCategory !== category
            );

            setSelectCategoryShopFilter(
                updatedCategorySelection.length ? updatedCategorySelection : []
            );

            setCategoryItemShopFilter(
                (prev) =>
                    prev?.filter((item) => item.categoryName !== category) ||
                    null
            );
        } else {
            // If the category is not selected, we add both the category and type
            const updatedCategorySelection = currentCategorySelection.filter(
                (cat) => cat !== 'All'
            );

            setSelectCategoryShopFilter([
                ...updatedCategorySelection,
                category,
            ]);

            setCategoryItemShopFilter((prev) => [
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
                    selectCategoryShopFilter?.includes(categoryName)
                        ? 'white'
                        : 'transparent'
                }
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                borderWidth={'1px'}
                borderRadius={'49px'}
                height={'60px'}
                cursor="pointer"
                color={
                    selectCategoryShopFilter?.includes(categoryName)
                        ? 'black'
                        : 'white'
                }
                padding="10px 24px"
                transition="background 0.1s ease-in-out, color 0.1s ease-in-out"
                onClick={() => {
                    toggleCategorySelection(categoryName);
                }}
            >
                {url?.length && (
                    <Image
                        src={url}
                        alt={categoryName}
                        width={20}
                        height={20}
                    />
                )}
                <Text ml="10px" fontSize={{ base: '14px', md: '16px' }}>
                    {categoryName}
                </Text>
            </Flex>
        </Flex>
    );
};

export default CategoryButton;
