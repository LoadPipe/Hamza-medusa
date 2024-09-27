'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Text,
    Card,
    CardBody,
    Stack,
    StackDivider,
    useDisclosure,
    CardFooter,
    ButtonGroup,
    Flex,
    Button,
    Image,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { getAllProductReviews, getNotReviewedOrders } from '@lib/data';
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
import Link from 'next/link';

const ReviewPage = ({ customer }: { customer: any }) => {
    const [reviews, setReviews] = useState([]);
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
    const [activeButton, setActiveButton] = useState('pending');
    const [pendingReviews, setPendingReviews] = useState([]);

    const fetchReviews = async () => {
        try {
            const response = await getAllProductReviews(customer.id);
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
            const response = await getNotReviewedOrders(customer.id);
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
        fetchPendingReviews();
        fetchReviews();
    }, [customer]);

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
            maxWidth={{
                sm: '450px',
                md: '430px',
                lg: '680px',
                xl: '950px',
            }}
            flexDir="column"
            mx="auto"
            bg="rgba(18, 18, 18, 0.9)"
            p={{ base: 4, md: 6, lg: 8 }}
            color={'white'}
            // overflow={{ base: 'auto', md: 'hidden' }}
        >
            <ButtonGroup
                isAttached
                justifyContent="center"
                flexWrap="nowrap"
                mb={{ base: 4, md: 8 }}
            >
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
                    <Stack divider={<StackDivider />} spacing={4}>
                        {reviews.map((review: any) => (
                            <CardBody key={review.id}>
                                <Flex
                                    direction={{ base: 'column', md: 'row' }}
                                    justify="space-between"
                                    align={{
                                        base: 'stretch',
                                        md: 'flex-start',
                                    }}
                                    gap={4}
                                >
                                    <Box flex="1" pr={{ base: 0, md: 4 }}>
                                        <Text
                                            fontSize={{
                                                base: '14px',
                                                md: '16px',
                                            }}
                                            pb={{ base: 2, md: 4 }}
                                        >
                                            <Text as="span" color="#555555">
                                                Purchase Date:{' '}
                                            </Text>
                                            {format(
                                                new Date(review.created_at),
                                                'PPP'
                                            )}
                                        </Text>
                                        <Flex alignItems="center" gap={2}>
                                            <Link
                                                href={`/us/products/${review.product.handle}`}
                                            >
                                                <Image
                                                    rounded="lg"
                                                    width={{
                                                        base: '72px',
                                                        md: '100px',
                                                    }}
                                                    height={{
                                                        base: '72px',
                                                        md: '100px',
                                                    }}
                                                    src={
                                                        review.product.thumbnail
                                                    }
                                                />
                                            </Link>
                                            <Text
                                                maxWidth="100%"
                                                fontSize={{
                                                    base: '14px',
                                                    md: '18px',
                                                }}
                                                fontWeight="bold"
                                                textTransform="uppercase"
                                                isTruncated
                                            >
                                                {review.title}
                                            </Text>
                                        </Flex>
                                        <Text
                                            my={2}
                                            fontSize={{
                                                base: '14px',
                                                md: '16px',
                                            }}
                                            fontWeight="bold"
                                            color="rgba(85, 85, 85, 0.6)"
                                        >
                                            Your Product Rating & Review:
                                        </Text>
                                        <Text
                                            p={2}
                                            fontSize={{
                                                base: '12px',
                                                md: 'sm',
                                            }}
                                            maxWidth="100%"
                                        >
                                            {renderStars(review.rating)}
                                        </Text>
                                        <Text
                                            rounded="lg"
                                            fontSize={{
                                                base: '12px',
                                                md: 'sm',
                                            }}
                                            bg="black"
                                            m={2}
                                            p={{ base: 4, md: 8 }}
                                        >
                                            {review.content}
                                        </Text>
                                        {review.order_id && (
                                            <Button
                                                m={{ base: 2, md: 4 }}
                                                height={'42px'}
                                                backgroundColor={'transparent'}
                                                border={'2px solid'} // Set the border width and style
                                                borderColor={'white'} // Set the border color
                                                color={'white'}
                                                borderRadius={'full'}
                                                onClick={() =>
                                                    handleReviewEdit(review)
                                                }
                                                width={{
                                                    base: 'full',
                                                    md: 'auto',
                                                }}
                                            >
                                                Update Review
                                            </Button>
                                        )}
                                    </Box>
                                </Flex>
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
                            {pendingReviews.map((review: any) =>
                                review.items.map((item: any) => (
                                    <CardBody key={item.id}>
                                        <Flex
                                            direction={{
                                                base: 'column',
                                                md: 'row',
                                            }}
                                            justify="space-between"
                                            align={{
                                                base: 'stretch',
                                                md: 'center',
                                            }}
                                            gap={4}
                                        >
                                            <Box
                                                flex="1"
                                                pr={{ base: 0, md: 4 }}
                                            >
                                                <Text
                                                    fontSize={{
                                                        base: '14px',
                                                        md: '16px',
                                                    }}
                                                    pb={{ base: 2, md: 4 }}
                                                >
                                                    <Text
                                                        as="span"
                                                        color="#555555"
                                                    >
                                                        Purchase Date:{' '}
                                                    </Text>
                                                    {format(
                                                        new Date(
                                                            review.created_at
                                                        ),
                                                        'PPP'
                                                    )}
                                                </Text>
                                                <Flex
                                                    alignItems="center"
                                                    gap={2}
                                                >
                                                    <Link
                                                        href={`/us/products/${item.variant.product.handle}`}
                                                    >
                                                        <Image
                                                            rounded="lg"
                                                            width={{
                                                                base: '72px',
                                                                md: '100px',
                                                            }}
                                                            height={{
                                                                base: '72px',
                                                                md: '100px',
                                                            }}
                                                            src={item.thumbnail}
                                                        />
                                                    </Link>
                                                    <Text
                                                        fontSize={{
                                                            base: '14px',
                                                            md: '18px',
                                                        }}
                                                        maxWidth="100%"
                                                        fontWeight="bold"
                                                        textTransform="uppercase"
                                                        isTruncated
                                                    >
                                                        {item.title}
                                                    </Text>
                                                </Flex>
                                            </Box>
                                            <Box>
                                                <Button
                                                    m={{ base: 2, md: 4 }}
                                                    backgroundColor={
                                                        'transparent'
                                                    }
                                                    border={'2px solid'} // Set the border width and style
                                                    borderColor={'white'} // Set the border color
                                                    color={'white'}
                                                    borderRadius={'full'}
                                                    onClick={() =>
                                                        handlePendingReview(
                                                            review
                                                        )
                                                    }
                                                    width={{
                                                        base: 'full',
                                                        md: 'auto',
                                                    }}
                                                >
                                                    Review This Product
                                                </Button>
                                            </Box>
                                        </Flex>
                                    </CardBody>
                                ))
                            )}
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
