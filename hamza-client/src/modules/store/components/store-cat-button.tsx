import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';

type StoreCatButtonProps = {
    categoryName: string;
};

const StoreCatButton: React.FC<StoreCatButtonProps> = ({ categoryName }) => {
    const { selectedCategories, setSelectedCategories } = useUnifiedFilterStore();

    const toggleCategorySelection = (category: string) => {
        const normalized = category.toLowerCase();
        if (normalized === 'all') {
            setSelectedCategories(['all']);
            return;
        }
        if (selectedCategories.includes(normalized)) {
            const updated = selectedCategories.filter(c => c !== normalized);
            setSelectedCategories(updated.length > 0 ? updated : ['all']);
        } else {
            const updated = selectedCategories.filter(c => c !== 'all');
            setSelectedCategories([...updated, normalized]);
        }
    };

    const formattedCatName = categoryName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

    const isSelected = selectedCategories.includes(categoryName.toLowerCase());

    return (
        <Flex
            minWidth={{ base: '94px', md: '167px' }}
            px={{ base: '1rem', md: '1.5rem' }}
            py={{ base: '0.75rem', md: '1rem' }}
            height={{ base: '42px', md: '66px' }}
            borderRadius={'49px'}
            borderWidth={'1px'}
            backgroundColor={isSelected ? 'white' : 'transparent'}
            color={isSelected ? 'black' : 'white'}
            justifyContent={'center'}
            alignItems={'center'}
            cursor={'pointer'}
            onClick={() => toggleCategorySelection(categoryName)}
            flexShrink={0}
            whiteSpace={'nowrap'}
            transition={'all 0.2s ease-in-out'}
            _hover={{
                borderColor: isSelected ? 'gray.300' : 'white',
                transform: 'translateY(-1px)',
            }}
        >
            <Text
                fontSize={{ base: '10px', md: '16px' }}
                fontWeight={'medium'}
                whiteSpace={'nowrap'}
                textAlign={'center'}
            >
                {formattedCatName}
            </Text>
        </Flex>
    );
};

export default StoreCatButton;
