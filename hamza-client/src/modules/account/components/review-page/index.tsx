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
import { format } from 'date-fns';
import { getAllProductReviews, getNotReviewedOrders } from '@lib/data';
import { EditIcon } from '@chakra-ui/icons';
import EditReviewTemplate from '@modules/editreview/[id]/edit-review-template';
import ReviewTemplate from '@modules/review/[id]/review-template';

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
    const {
        isOpen: isEditReviewOpen,
        onOpen: onEditReviewOpen,
        onClose: onEditReviewClose,
    } = useDisclosure();
    const {
        isOpen: isReviewOpen,
        onOpen: onReviewOpen,
        onClose: onReviewClose,
    } = useDisclosure();
    const [selectedReview, setSelectedReview] = useState(null);
    const [selectedPendingReview, setSelectedPendingReview] = useState(null);
    const [activeButton, setActiveButton] = useState('reviews');
    const [pendingReviews, setPendingReviews] = useState([]);

    const fetchReviews = async () => {
        try {
            const response = await getAllProductReviews(
                authData.customer_id as string
            );
            if (response.length !== 0) setReviews(response);
            console.log('Reviews:', JSON.stringify(response));
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleReviewUpdated = async () => {
        // This function will be called after a review is updated
        await fetchReviews();
    };

    const handlePendingUpdated = async () => {
        await fetchPendingReviews();
    };

    const fetchPendingReviews = async () => {
        console.log('Fetching pending reviews...'); // For debugging
        try {
            const response = await getNotReviewedOrders(
                authData.customer_id as string
            );
            console.log(`Response ${JSON.stringify(response)}`);
            if (response.length !== 0) {
                setPendingReviews(response);
            } else {
                setPendingReviews([]);
            }
            console.log(`Pending reviews: ${JSON.stringify(response)}`); // For debugging
        } catch (error) {
            console.error(`Error fetching not reviewed orders: ${error}`);
            // Handle error state in UI if necessary, e.g., show a message
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
        onEditReviewOpen();
    };

    const handlePendingReview = (review: any) => {
        setSelectedPendingReview(review);
        console.log(`Selecting pending review`);
        onReviewOpen();
    };

    return (
        <Card
            width={'900px'}
            bg={'rgba(18, 18, 18, 0.9)'}
            p={8}
            textColor={'white'}
        >
            <ButtonGroup isAttached justifyContent="center">
                <Button
                    onClick={() => {
                        fetchPendingReviews()
                            .then(() => {
                                console.log('Fetch successful');
                                setActiveButton('pending');
                            })
                            .catch((error) => {
                                console.error('Failed to fetch: ', error);
                            });
                    }}
                    {...commonButtonStyles}
                    isActive={activeButton === 'pending'}
                >
                    Pending Reviews
                </Button>

                <Button
                    onClick={() => {
                        fetchReviews();
                        setActiveButton('reviews');
                    }}
                    {...commonButtonStyles}
                    isActive={activeButton === 'reviews'}
                >
                    Review Archives
                </Button>
            </ButtonGroup>
            {activeButton === 'reviews' && reviews.length > 0 && (
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
                                            Edit
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

            {activeButton === 'pending' && (
                <>
                    {pendingReviews.length > 0 ? (
                        <Stack divider={<StackDivider />} spacing={4}>
                            {pendingReviews.map((review: any) => (
                                <CardBody key={review.id}>
                                    {review.items.length > 0 && (
                                        <>
                                            <Text fontSize="16px">
                                                <Text as="span" color="#555555">
                                                    Purchase Date:{' '}
                                                </Text>
                                                {format(
                                                    new Date(review.created_at),
                                                    'PPP'
                                                )}
                                            </Text>
                                            <div className="flex flex-row space-x-2 items-center">
                                                <Image
                                                    rounded={'lg'}
                                                    width={'72px'}
                                                    height={'72px'}
                                                    src={
                                                        review.items[0]
                                                            .thumbnail
                                                    }
                                                />
                                                <Text
                                                    fontSize={'18px'}
                                                    fontWeight={'bold'}
                                                    textTransform="uppercase"
                                                >
                                                    {review.items[0].title}
                                                    Accessing the first item
                                                </Text>
                                                <Button
                                                    onClick={() =>
                                                        handlePendingReview(
                                                            review
                                                        )
                                                    }
                                                    colorScheme="green"
                                                >
                                                    Review
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </CardBody>
                            ))}
                        </Stack>
                    ) : (
                        <Box textAlign="center" py={5}>
                            <Text color="red.500" fontSize="lg">
                                No pending reviews available.
                            </Text>
                        </Box>
                    )}
                    <CardFooter />
                </>
            )}

            {selectedPendingReview && (
                <ReviewTemplate
                    reviewItem={selectedPendingReview}
                    isOpen={isReviewOpen}
                    onClose={onReviewClose}
                    onPendingReviewUpdated={handlePendingUpdated}
                />
            )}

            {selectedReview && (
                <EditReviewTemplate
                    review={selectedReview}
                    isOpen={isEditReviewOpen}
                    onClose={onEditReviewClose}
                    onReviewUpdated={handleReviewUpdated}
                />
            )}
        </Card>
    );
};

export default ReviewPage;
