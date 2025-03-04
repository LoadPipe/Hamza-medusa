import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';

interface CategoryButtonModalProps {
    categoryName: string;
    url: string;
}

const CategoryButtonModal: React.FC<CategoryButtonModalProps> = ({
    categoryName,
    
    url,
}) => {
    const { selectedCategories, setSelectedCategories } = useUnifiedFilterStore();

    const identifier = categoryName.toLowerCase();
    const isSelected = selectedCategories.includes(identifier);

    const toggleCategorySelection = (category: string) => {
        const normalized = category.toLowerCase();
        if (normalized === 'all') {
            setSelectedCategories(['all']);
            return;
        }
        if (selectedCategories.includes(normalized)) {
            const updated = selectedCategories.filter(c => c !== normalized);
            setSelectedCategories(updated.length ? updated : ['all']);
        } else {
            const updated = selectedCategories.filter(c => c !== 'all');
            setSelectedCategories([...updated, normalized]);
        }
    };

    return (
        <Flex
            borderColor={'secondary.davy.900'}
            backgroundColor={isSelected ? 'white' : 'transparent'}
            display={'flex'}
            flexDirection={'row'}
            alignItems={'center'}
            borderWidth={'1px'}
            borderRadius={'49px'}
            height={'42px'}
            cursor="pointer"
            color={isSelected ? 'black' : 'white'}
            padding="10px 24px"
            transition="background 0.1s ease-in-out, color 0.1s ease-in-out"
            onClick={() => toggleCategorySelection(identifier)}
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
    );
};

export default CategoryButtonModal;
