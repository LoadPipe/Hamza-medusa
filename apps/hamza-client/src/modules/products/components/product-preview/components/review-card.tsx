import React from 'react';
import { Text, Flex, Heading, Box } from '@chakra-ui/react';
import { renderStars } from '../../review-stars';

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

                <Flex mt="1rem">{renderStars(stars)}</Flex>
                <Text
                    mt="1.5rem"
                    color="white"
                    noOfLines={6}
                    maxWidth="480px"
                    textOverflow="ellipsis"
                >
                    {review}
                </Text>
            </Flex>
        </Flex>
    );
};

export default ReviewCard;
