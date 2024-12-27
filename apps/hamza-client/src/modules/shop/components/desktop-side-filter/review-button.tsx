import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Text, Flex, Box } from '@chakra-ui/react';
import ReviewStar from '../../../../public/images/products/review-star.svg';

// Define the props type with TypeScript
interface ReviewButtonProps {
    title: string;
    value: string;
}

const ReviewButton: React.FC<ReviewButtonProps> = ({ title, value }) => {
    return (
        <Flex>
            <Flex
                // onClick={() => setReviewFilterSelect(value)}
                // backgroundColor={ reviewFilterSelect === title ? 'white' : 'transparent'}
                borderColor={'secondary.davy.900'}
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'center'}
                alignItems={'center'}
                borderWidth={'1px'}
                borderRadius={'49px'}
                height={'60px'}
                width={{ base: '125px', md: '154px' }}
                style={{ padding: '10px 24px', cursor: 'pointer' }}
                //color={reviewFilterSelect === title ? 'black' : 'white'}
                transition="background 0.1s ease-in-out, color 0.1s ease-in-out"
                _hover={{
                    background: 'white',
                    color: 'black',
                }}
            >
                <Image src={ReviewStar} alt={title} />
                <Flex justifyContent={'flex-start'} flex="1">
                    <Text ml="10px" fontSize={{ base: '14px', md: '16px' }}>
                        {title}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default ReviewButton;
