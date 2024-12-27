import React from 'react';
import Image from 'next/image';
import { Text, Flex } from '@chakra-ui/react';

// Define the props type
interface FilterTagProps {
    categoryIconUrl: string; // The URL for the image
    categoryName: string; // The name for the category or tag
}

const FilterTag: React.FC<FilterTagProps> = ({
    categoryIconUrl,
    categoryName,
}) => {
    return (
        <Flex>
            <Flex
                backgroundColor={'#020202'}
                borderColor={'#3E3E3E'}
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                borderWidth={'1px'}
                borderRadius={'49px'}
                height={'63px'}
                style={{ padding: '10px 24px' }}
            >
                {categoryIconUrl?.length && (
                    <Image
                        src={categoryIconUrl}
                        alt={categoryName}
                        width={20}
                        height={20}
                    />
                )}
                <Text ml="10px" fontSize="18px" color="white">
                    {categoryName}
                </Text>
            </Flex>
        </Flex>
    );
};

export default FilterTag;
