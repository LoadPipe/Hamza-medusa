import React from 'react';
import { Text, Flex, Heading, Box } from '@chakra-ui/react';
import Image from 'next/image';
import ReviewStar from '../../../../../../public/images/products/review-star.svg';

interface ReviewCardProps {
    name: string;
    location: string;
    review: string;
    stars: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
    name,
    location,
    review,
    stars,
}) => {
    return (
        <Flex width={'506.63px'}>
            <Flex flexDirection={'column'}>
                <Flex>
                    <Box
                        width="76px"
                        height="76px"
                        backgroundColor="white"
                        borderRadius={'full'}
                    />

                    <Flex
                        ml="1rem"
                        flexDirection={'column'}
                        alignSelf={'center'}
                    >
                        <Heading as="h2" color="white" fontSize={'24px'}>
                            {name}
                        </Heading>
                        <Text color="primary.green.900">{location}</Text>
                    </Flex>
                </Flex>

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
                <Text mt="1.5rem" color="white" noOfLines={4}>
                    {review}
                </Text>
            </Flex>
        </Flex>
    );
};

export default ReviewCard;
