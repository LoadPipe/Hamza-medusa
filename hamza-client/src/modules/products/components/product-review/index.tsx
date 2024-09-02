'use client';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Flex,
    Heading,
    Stack,
    Text,
    Button,
    Progress,
    StackDivider,
    Box,
} from '@chakra-ui/react';
import { getAverageRatings, getAllProductReviews, getReviewCount } from '@lib/data';

const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

type Review = {
    id: string;
    created_at: string;
    updated_at: string;
    product_id: string;
    title: string;
    customer_id: string;
    order_id: string | null;
    rating: number;
    content: string;
};

type ProductReviewProps = {
    product: any;
    countryCode: string;
};

const ProductReview: React.FC<ProductReviewProps> = ({
    product,
    countryCode,
}) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [reviewCount, setReviewCount] = useState<number>(0);
    const [ratingDistribution, setRatingDistribution] = useState<{
        [key: number]: number;
    }>({});

    useEffect(() => {
        const fetchReviewData = async () => {
            // API calls remain the same
            const averageRatingResponse = await getAverageRatings(product.id);
            const reviewCountResponse = await getReviewCount(product.id);
            const reviewsResponse = await getAllProductReviews(product.id);

            setAverageRating(averageRatingResponse);
            setReviewCount(reviewCountResponse);
            setReviews(reviewsResponse);

            // Initialize the rating distribution to ensure all ratings from 1 to 5 are accounted for
            const initialRatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            const distribution = reviewsResponse.reduce(
                (acc: { [key: string]: any }, review: any) => {
                    acc[review.rating] = (acc[review.rating] || 0) + 1;
                    return acc;
                },
                initialRatingDistribution
            );

            setRatingDistribution(distribution);
        };

        fetchReviewData();
    }, [product.id]);

    const ratings = Object.keys(ratingDistribution).sort(
        (a: any, b: any) => b - a
    ); // Sort ratings descending
    const initialRatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    // console.log(`****** Average rating {averageRating} ******`);
    return (
        <Box className="bg-black text-white p-4">
            <Stack
                spacing={5}
                mb={8}
                justifyContent="center"
                alignItems="center"
            >
                <Heading size="lg" mb={4}>
                    {reviews.length > 0 ? (
                        <>Average Rating: {averageRating} / 5</>
                    ) : (
                        'no reviews for this product yet'
                    )}
                </Heading>
                {[5, 4, 3, 2, 1].map((rating) => (
                    <Flex key={rating} align="center">
                        {/* Static display of stars */}
                        <Box mr={4}>
                            <span className="text-yellow-500 text-2xl">
                                {'★'.repeat(rating) + '☆'.repeat(5 - rating)}
                            </span>
                        </Box>
                        <Text flexShrink={0} mr={4}>
                            {rating} Stars
                        </Text>
                        <Box>
                            {' '}
                            {/* Adjust the width as necessary */}
                            <Progress
                                width={'400px'}
                                colorScheme="yellow"
                                size="md"
                                value={ratingDistribution[rating]}
                                max={reviewCount}
                                hasStripe
                                isAnimated
                            />
                        </Box>
                        <Text m={2}>{ratingDistribution[rating]}</Text>
                    </Flex>
                ))}
            </Stack>

            <Card>
                {reviews.length > 0 && (
                    <>
                        <CardHeader>
                            <Heading size="md">Product Reviews</Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing={4}>
                                {reviews.map((review) => (
                                    <Box key={(review as any).id}>
                                        <Heading
                                            size="xs"
                                            textTransform="uppercase"
                                        >
                                            {review.title}
                                        </Heading>
                                        <Text fontSize="sm">
                                            Customer ID: {review.customer_id}
                                        </Text>
                                        <Text fontSize="sm">
                                            Rating: {review.rating} / 5
                                        </Text>
                                        <Text fontSize="sm">
                                            {review.content}
                                        </Text>
                                        <Text fontSize="sm">
                                            Date:{' '}
                                            {format(
                                                new Date(review.created_at),
                                                'PPP'
                                            )}
                                        </Text>
                                    </Box>
                                ))}
                            </Stack>
                        </CardBody>
                        <CardFooter></CardFooter>
                    </>
                )}
            </Card>
        </Box>
    );
};

export default ProductReview;
