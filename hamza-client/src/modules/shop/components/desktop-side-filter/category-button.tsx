import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';

interface CategoryButtonProps {
    categoryName: string;
    url: string;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ categoryName, url }) => {
    const { selectedCategories, setSelectedCategories } = useUnifiedFilterStore();

    const toggleCategorySelection = (category: string) => {
        const normalized = category.toLowerCase();
        if (normalized === 'all') {
            setSelectedCategories(['all']);
            return;
        }
        if (selectedCategories.includes(normalized)) {
            const updated = selectedCategories.filter((c) => c !== normalized);
            setSelectedCategories(updated.length ? updated : ['all']);
        } else {
            const updated = selectedCategories.filter((c) => c !== 'all');
            setSelectedCategories([...updated, normalized]);
        }
    };

    const isSelected = selectedCategories.includes(categoryName.toLowerCase());

    return (
        <Flex>
            <Flex
                borderColor={'secondary.davy.900'}
                backgroundColor={isSelected ? 'white' : 'transparent'}
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                borderWidth={'1px'}
                borderRadius={'49px'}
                height={'60px'}
                cursor="pointer"
                color={isSelected ? 'black' : 'white'}
                padding="10px 24px"
                transition="background 0.1s ease-in-out, color 0.1s ease-in-out"
                onClick={() => toggleCategorySelection(categoryName)}
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
