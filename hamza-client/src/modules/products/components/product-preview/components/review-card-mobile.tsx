import React from 'react';
import { Text, Box, Flex, Heading } from '@chakra-ui/react';
import { renderStars } from '../../review-stars';

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
                <Flex mt="1rem">{renderStars(stars)}</Flex>

                <Text
                    mt="1.5rem"
                    fontSize={'14px'}
                    color="white"
                    width="257.91px"
                >
                    {review}
                </Text>

                <Flex my="2rem">
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
