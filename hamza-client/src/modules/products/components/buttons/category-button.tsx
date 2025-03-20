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

    const identifier = categoryName.trim().replace(/[\s_]+/g, '-').toLowerCase();
    const isSelected = selectedCategories.includes(identifier);

    const toggleCategorySelection = (category: string) => {
        const normalizedCategory = category.toLowerCase();
        const currentSelection = selectedCategories || [];

        if (normalizedCategory === 'all') {
            setSelectedCategories(['all']);
            return;
        }

        if (currentSelection.includes(normalizedCategory)) {
            const updated = currentSelection.filter((c) => c !== normalizedCategory);
            setSelectedCategories(updated.length ? updated : ['all']);
        } else {
            const updated = currentSelection.filter((c) => c !== 'all');
            setSelectedCategories([...updated, normalizedCategory]);
        }
    };
    return (
        <Flex
            flexShrink={0}
            onClick={() => toggleCategorySelection(identifier)}
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
