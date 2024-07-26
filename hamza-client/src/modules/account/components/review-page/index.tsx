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
import { getAllProductReviews } from '@lib/data';
import { EditIcon } from '@chakra-ui/icons';
import Link from 'next/link';

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

const ReviewPage = ({ region }: { region: Region }) => {
    const [reviews, setReviews] = useState([]);
    const { authData } = useCustomerAuthStore();

    useEffect(() => {
        if (authData.status == 'authenticated') {
            const fetchReviews = async () => {
                try {
                    const response = await getAllProductReviews(
                        authData.customer_id as string
                    );
                    setReviews(response);
                } catch (error) {
                    console.error('Error fetching reviews:', error);
                }
            };
            fetchReviews();
        }
    }, [authData.status]);

    return (
        <Card
            width={'900px'}
            bg={'rgba(18, 18, 18, 0.9)'}
            p={8}
            textColor={'white'}
        >
            {reviews.length > 0 && (
                <>
                    <CardHeader>
                        <Heading size="md">My Product Reviews</Heading>
                    </CardHeader>
                    <CardBody>
                        <Stack divider={<StackDivider />} spacing={4}>
                            {reviews.map((review: any) => (
                                <Box key={review.id}>
                                    <div className="flex flex-row space-x-2 items-center">
                                        <Heading
                                            size="xs"
                                            textTransform="uppercase"
                                        >
                                            {review.title}
                                        </Heading>
                                        {review.order_id && (
                                            <Link
                                                href={`/account/editreview/${review.order_id}`}
                                            >
                                                <EditIcon className="cursor-pointer" />
                                            </Link>
                                        )}
                                    </div>
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
