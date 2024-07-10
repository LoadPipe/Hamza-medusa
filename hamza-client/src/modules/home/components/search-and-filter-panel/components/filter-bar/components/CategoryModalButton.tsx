import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import useModalFilter from '@store/store-page/filter-modal';
import useHomeModalFilter from '@store/home-page/home-filter/home-filter';
import categoryIcons from '../data/cat-icons';

interface CategoryButtonProps {
    categoryName: string;
    categoryType: string;
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

    return (
        <Flex>
            <Flex
                borderColor={'secondary.davy.900'}
                backgroundColor={
                    homeModalCategoryFilterSelect === categoryName
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
                onClick={() => {
                    setHomeModalCategoryFilterSelect(categoryName),
                        setHomeModalCategoryTypeFilterSelect(categoryType);
                }}
            >
                <Image src={categoryIcons[categoryType]} alt={categoryName} />
                <Text ml="10px" fontSize={{ base: '14px', md: '16px' }}>
                    {categoryName}
                </Text>
            </Flex>
        </Flex>
    );
};

export default CategoryModalButton;
