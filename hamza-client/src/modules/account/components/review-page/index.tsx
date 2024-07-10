'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Text,
    Card,
    CardHeader,
    CardBody,
    Stack,
    StackDivider,
    CardFooter,
} from '@chakra-ui/react';
import { Region } from '@medusajs/medusa';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import axios from 'axios';
import { format } from 'date-fns';

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

const ReviewPage = ({ region }: { region: Region }) => {
    const [reviews, setReviews] = useState([]);
    const { authData } = useCustomerAuthStore();

    useEffect(() => {
        if (authData.customer_id) {
            const fetchReviews = async () => {
                try {
                    const response = await axios.post(
                        `${BACKEND_URL}/custom/review/all-customer-reviews`,
                        { customer_id: authData.customer_id },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    setReviews(response.data);
                } catch (error) {
                    console.error('Error fetching reviews:', error);
                }
            };
            fetchReviews();
        }
    }, [authData.customer_id]);

    return (
        <Card>
            {reviews.length > 0 && (
                <>
                    <CardHeader>
                        <Heading size="md">My Product Reviews</Heading>
                    </CardHeader>
                    <CardBody>
                        <Stack divider={<StackDivider />} spacing={4}>
                            {reviews.map((review: any) => (
                                <Box key={review.id}>
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
                                        Review: {review.content}
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
                    <CardFooter />
                </>
            )}
        </Card>
    );
};

export default ReviewPage;
