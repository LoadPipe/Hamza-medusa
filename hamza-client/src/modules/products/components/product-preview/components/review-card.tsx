import React from 'react';
import { Text, Flex, Heading, Box } from '@chakra-ui/react';
import Image from 'next/image';
import ReviewStar from '../../../../../../public/images/products/review-star.svg';
import {
    TiStarFullOutline,
    TiStarHalfOutline,
    TiStarOutline,
} from 'react-icons/ti';

interface ReviewCardProps {
    name: string;
    location: string;
    review: string;
    stars: number;
}

export const renderStars = (rating: any) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex">
            {Array(fullStars)
                .fill(null)
                .map((_, index) => (
                    <TiStarFullOutline
                        key={`full-${index}`}
                        className="text-yellow-500 text-2xl"
                    />
                ))}
            {halfStar && (
                <TiStarHalfOutline className="text-yellow-500 text-2xl" />
            )}
            {Array(emptyStars)
                .fill(null)
                .map((_, index) => (
                    <TiStarOutline
                        key={`empty-${index}`}
                        className="text-yellow-500 text-2xl"
                    />
                ))}
        </div>
    );
};

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
