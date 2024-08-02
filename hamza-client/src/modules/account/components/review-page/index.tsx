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
    useDisclosure,
    CardFooter,
    ButtonGroup,
    Button,
    Image,
} from '@chakra-ui/react';
import { Region } from '@medusajs/medusa';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import axios from 'axios';
import { format } from 'date-fns';
import { getAllProductReviews } from '@lib/data';
import { EditIcon } from '@chakra-ui/icons';
import EditReviewTemplate from '@modules/editreview/[id]/edit-review-template';
import Link from 'next/link';
import {
    TiStarFullOutline,
    TiStarHalfOutline,
    TiStarOutline,
} from 'react-icons/ti';

const commonButtonStyles = {
    borderRadius: '8px',
    width: '415px',
    height: '56px',
    padding: '16px',
    bg: 'gray.900',
    borderColor: 'transparent',
    color: 'white',
    _hover: {
        // Assuming you want hover effects as well
        bg: 'gray.200',
        color: 'black',
    },
    _active: {
        bg: 'primary.green.900',
        color: 'black',
        transform: 'scale(0.98)',
        borderColor: '#bec3c9',
    },
};
import { renderStars } from '@modules/products/components/product-preview/components/review-card';

const ReviewPage = ({ region }: { region: Region }) => {
    const [reviews, setReviews] = useState([]);
    const { authData } = useCustomerAuthStore();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedReview, setSelectedReview] = useState(null);
    const fetchReviews = async () => {
        try {
            const response = await getAllProductReviews(
                authData.customer_id as string
            );
            setReviews(response);
            console.log('Reviews:', JSON.stringify(response));
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };
    useEffect(() => {
        console.log(`trigger outter GETTER`);
        if (authData.status == 'authenticated') {
            console.log(`trigger AUTHENTICATED GETTER`);
            fetchReviews();
        }
    }, [authData.status]);

    const handleReviewEdit = (review: any) => {
        setSelectedReview(review);
        console.log(`selected review modal`);
        onOpen();
    };

    return (
        <Card
            width={'900px'}
            bg={'rgba(18, 18, 18, 0.9)'}
            p={8}
            textColor={'white'}
        >
            <ButtonGroup isAttached justifyContent="center">
                <Button {...commonButtonStyles}>Pending Reviews</Button>
                <Button isActive={true} {...commonButtonStyles}>
                    Review Archives
                </Button>
            </ButtonGroup>
            {reviews.length > 0 && (
                <>
                    <CardHeader>
                        <Heading size="md">My Product Reviews</Heading>
                    </CardHeader>
                    <Stack divider={<StackDivider />} spacing={4}>
                        {reviews.map((review: any) => (
                            <CardBody key={review.id}>
                                <Text fontSize="16px">
                                    <Text as="span" color="#555555">
                                        Purchase Date:{' '}
                                    </Text>
                                    {format(new Date(review.created_at), 'PPP')}
                                </Text>
                                <div className="flex flex-row space-x-2 items-center">
                                    <Image
                                        rounded={'lg'}
                                        width={'72px'}
                                        height={'72px'}
                                        src={review.product.thumbnail}
                                    />
                                    <Text
                                        fontSize={'18px'}
                                        fontWeight={'bold'}
                                        textTransform="uppercase"
                                    >
                                        {review.title}
                                    </Text>
                                    {review.order_id && (
                                        <Button
                                            onClick={() =>
                                                handleReviewEdit(review)
                                            }
                                            colorScheme="green"
                                        >
                                            Update Review
                                        </Button>
                                    )}
                                </div>
                                <Box my={'4'}>
                                    <Text
                                        mb={'2'}
                                        fontSize={'16px'}
                                        fontWeight={'bold'}
                                        color={'rgba(85, 85, 85, 0.6)'}
                                    >
                                        Your Product rating & review:
                                    </Text>
                                    <Text p={'2'} fontSize="sm">
                                        {renderStars(review.rating)}
                                    </Text>
                                    <Text
                                        rounded={'lg'}
                                        fontSize="sm"
                                        bg={'black'}
                                        m={2}
                                        p={8}
                                    >
                                        {review.content}
                                    </Text>
                                </Box>
                            </CardBody>
                        ))}
                    </Stack>
                    <CardFooter />
                </>
            )}
            {selectedReview && (
                <EditReviewTemplate
                    review={selectedReview}
                    isOpen={isOpen}
                    onClose={onClose}
                />
            )}
        </Card>
    );
};

export default ReviewPage;
