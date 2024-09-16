import React from 'react';
import { Text, Flex } from '@chakra-ui/react';
import useHomeProductsPage from '@store/home-page/product-layout/product-layout';
import Image from 'next/image';

interface CategoryButtonProps {
    categoryName: string;
    categoryType: string;
    url: string;
}

const CategoryButtons: React.FC<CategoryButtonProps> = ({
    categoryName,
    categoryType,
    url,
}) => {
    const { categorySelect, setCategorySelect, setCategoryTypeSelect } =
        useHomeProductsPage();

    return (
        <Flex
            flexShrink={0}
            onClick={() => {
                setCategorySelect([categoryName]), // Wrap categoryName in an array
                    setCategoryTypeSelect([categoryType]); // Wrap categoryType in an array
            }}
            borderColor={'#3E3E3E'}
            backgroundColor={
                categorySelect !== null && categorySelect[0] === categoryName
                    ? 'white'
                    : 'black'
            }
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            borderWidth={'1px'}
            borderRadius={'49px'}
            height={{ base: '42px', md: '63px' }}
            cursor="pointer"
            style={{ padding: '10px 24px' }}
            color={
                categorySelect !== null && categorySelect[0] === categoryName
                    ? 'black'
                    : 'white'
            }
            transition="background 0.1s ease-in-out, color 0.1s ease-in-out"
            _hover={{
                color: 'black',
                background: 'white',
            }}
        >
            {url?.length &&
                <Image
                    src={url}
                    alt={categoryName}
                    width={20} // Set appropriate width
                    height={20} // Set appropriate height
                />
            }

            <Text ml="10px" fontSize={{ base: '14px', md: '18px' }}>
                {categoryName}
            </Text>
        </Flex>
    );
};

export default CategoryButtons;
