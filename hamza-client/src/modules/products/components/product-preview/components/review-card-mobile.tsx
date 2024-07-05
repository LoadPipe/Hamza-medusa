import React from 'react';
import { Text, Box, Flex, Heading } from '@chakra-ui/react';
import Image from 'next/image';
import ReviewStar from '../../../../../../public/images/products/review-star.svg';

interface ReviewCardProps {
    name: string;
    location: string;
    review: string;
    stars: number;
}

const ReviewCardMobile: React.FC<ReviewCardProps> = ({
    name,
    location,
    review,
    stars,
}) => {
    return (
        <Flex
            gap={'10px'}
            width={'290.65px'}
            padding={'1rem'}
            height="317.54px"
            borderRadius={'16px'}
            background="linear-gradient(317.5deg, #53594A 42.03%, #2C272D 117.46%, #2C272D 117.46%)"
        >
            <Flex flexDirection={'column'}>
                <Flex mt="1rem">
                    {Array(stars)
                        .fill(0)
                        .map((_, index) => (
                            <Image
                                style={{ width: '16px', height: '16px' }}
                                src={ReviewStar}
                                alt="star"
                                key={index}
                            />
                        ))}
                </Flex>

                <Text
                    mt="1.5rem"
                    fontSize={'14px'}
                    color="white"
                    width="257.91px"
                >
                    {review}
                </Text>

                <Flex my="2rem">
                    <Box
                        width="40px"
                        height="40px"
                        backgroundColor="white"
                        borderRadius={'full'}
                    />

                    <Flex
                        ml="0.5rem"
                        flexDirection={'column'}
                        alignSelf={'center'}
                    >
                        <Heading as="h2" color="white" fontSize={'16px'}>
                            {name}
                        </Heading>
                        <Text color="primary.green.900" fontSize={'14px'}>
                            {location}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default ReviewCardMobile;
