import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';

interface CategoryButtonProps {
    categoryName: string;
    url: string;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
    categoryName,
    url,
}) => {
    const { selectedCategories, setSelectedCategories } = useUnifiedFilterStore();

    const normalizeCategory = (name: string) => {
        return name.trim().toLowerCase();
    };

    const normalizedCategory = normalizeCategory(categoryName);
    const isSelected = selectedCategories.includes(normalizedCategory);

    const toggleCategorySelection = (category: string) => {
        const normalizedCat = normalizeCategory(category);
        const currentSelection = selectedCategories || [];

        if (normalizedCat === 'all') {
            setSelectedCategories(['all']);
            return;
        }

        if (currentSelection.includes(normalizedCat)) {
            const updated = currentSelection.filter((c) => c !== normalizedCat);
            setSelectedCategories(updated.length ? updated : ['all']);
        } else {
            const updated = currentSelection.filter((c) => c !== 'all');
            setSelectedCategories([...updated, normalizedCat]);
        }
    };
    return (
        <Flex
            flexShrink={0}
            onClick={() => toggleCategorySelection(categoryName)}
            borderColor={'#3E3E3E'}
            backgroundColor={isSelected ? 'white' : 'black'}
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            borderWidth={'1px'}
            borderRadius={'49px'}
            height={{ base: '42px', md: '63px' }}
            cursor="pointer"
            style={{ padding: '10px 24px' }}
            color={isSelected ? 'black' : 'white'}
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

export default CategoryButton;
