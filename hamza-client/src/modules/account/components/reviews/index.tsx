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
import { useQuery } from '@tanstack/react-query';
import Spinner from '@modules/common/icons/spinner';

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
/**
 * The ReviewPage component is responsible for displaying both pending reviews and previously submitted reviews for a customer.
 * It allows users to see which products they have purchased but have yet to review, and provides a way to edit or submit reviews for those products.
 * The component leverages React Query's `useQuery` to handle data fetching, caching, and error handling efficiently.
 *
 * @Author: [Garo Nazarian]
 *
 * Features:
 * - Fetches and displays all product reviews and pending reviews for a specific customer.
 * - Handles loading and error states with graceful UI messages.
 * - Allows users to switch between pending reviews and review archives using a tab interface.
 * - Supports editing existing reviews and submitting reviews for pending items.
 * - Utilizes Chakra UI for responsive styling and modals for review interactions.
 *
 * Usage:
 * Should be placed in a customer’s profile or order history section where users can manage their product reviews.
 * Ensures that reviews are properly fetched and provides UI feedback during loading or errors.
 */

const ReviewPage = ({ customer }: { customer: any }) => {
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

    // useQuery for pending reviews
    const {
        data: pendingReviews,
        isLoading: pendingLoading,
        isStale: pendingIsStale,
        isError: pendingError,
        refetch: fetchPendingReviews,
        isSuccess: pendingSuccess,
    } = useQuery(
        ['pendingReviewsQuery', customer?.id],
        () => getNotReviewedOrders(customer.id),
        {
            enabled: !!customer.id, // Ensure query only runs when enabled is true
            staleTime: 0,
            cacheTime: 0,
            retry: 5, // Retry 5 times
            retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 20000), // Exponential backoff with max delay of 20 seconds
            refetchOnWindowFocus: false,
        }
    );

    // useQuery for reviewed items..
    const {
        data: reviews,
        isLoading: reviewsLoading,
        isLoadingError: reviewsLoadingError,
        isFetching: reviewsFetching,
        failureCount: reviewsFailureCount,
        failureReason: reviewsFailureReason,
        isStale: reviewsIsStale,
        isError: reviewsError,
        refetch,
        isRefetching,
    } = useQuery(
        ['reviewQuery', customer?.id],
        () => getAllProductReviews(customer.id),
        {
            enabled: !!customer.id && pendingSuccess, // Ensure query only runs when enabled is true
            staleTime: 0,
            cacheTime: 0,
            retry: 5, // Retry 5 times
            retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 20000), // Exponential backoff with max delay of 20 seconds
            refetchOnWindowFocus: false,
        }
    );

    console.log(`STALE REVIEW ${reviewsIsStale}`);

    useEffect(() => {
        console.log(`OK IT IS REFETCHING? ${isRefetching}`);
    }, [isRefetching]);

    useEffect(() => {
        if (reviewsIsStale && reviews === undefined) {
            console.log('Reviews are stale, attempting refetch');
            refetch();
        }
    }, [reviewsIsStale, reviews]);

    useEffect(() => {
        if (pendingIsStale && pendingReviews === undefined) {
            console.log('Pending reviews are stale, refetching');
            fetchPendingReviews();
        }
    }, [pendingIsStale, pendingReviews]);

    const handleReviewUpdated = async () => {
        // Check that refetch is properly triggered
        const refetchResult = await refetch();
        console.log('Refetch result:', refetchResult);
    };

    const handlePendingUpdated = async () => {
        await fetchPendingReviews();
    };

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
            width="100%"
            maxWidth={{ base: '100%', md: '700px', lg: '900px' }}
            mx="auto"
            bg="rgba(18, 18, 18, 0.9)"
            p={{ base: 4, md: 8 }}
            textColor="white"
        >
            <ButtonGroup
                isAttached
                justifyContent="center"
                flexWrap="nowrap"
                mb={{ base: 4, md: 8 }}
            >
                <Button
                    onClick={() => {
                        setActiveButton('pending');
                    }}
                    {...commonButtonStyles}
                    isActive={activeButton === 'pending'}
                    // isLoading={pendingLoading}
                >
                    Pending Reviews
                </Button>

                <Button
                    onClick={() => {
                        setActiveButton('reviews');
                        handleReviewUpdated();
                    }}
                    {...commonButtonStyles}
                    isActive={activeButton === 'reviews'}
                    // isLoading={reviewsLoading}
                >
                    Review Archives
                </Button>
            </ButtonGroup>

            {activeButton === 'reviews' && (
                <>
                    {reviewsLoading ? (
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            textAlign="center"
                            py={5}
                        >
                            <Text color="white" fontSize="lg" mb={8}>
                                Loading reviews...
                            </Text>
                            <Spinner size={80} />
                        </Box>
                    ) : reviewsError ? (
                        <Box textAlign="center" py={5}>
                            <Text color="red.500" fontSize="lg">
                                Error fetching reviews.
                            </Text>
                        </Box>
                    ) : reviews?.length > 0 ? (
                        <Stack divider={<StackDivider />} spacing={4}>
                            {reviews.map((review: any) => (
                                <CardBody key={review.id}>
                                    <Flex
                                        direction={{
                                            base: 'column',
                                            md: 'row',
                                        }}
                                        justify="space-between"
                                        align={{
                                            base: 'stretch',
                                            md: 'flex-start',
                                        }}
                                        gap={4}
                                    >
                                        <Box flex="1" pr={{ base: 0, md: 4 }}>
                                            <Box
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
                                            </Box>
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
                                                            review.product
                                                                .thumbnail
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
                                                    onClick={() =>
                                                        handleReviewEdit(review)
                                                    }
                                                    colorScheme="green"
                                                    width={{
                                                        base: 'full',
                                                        md: 'auto',
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                        </Box>
                                    </Flex>
                                </CardBody>
                            ))}
                        </Stack>
                    ) : (
                        <Box textAlign="center" py={5}>
                            <Text>No reviews available.</Text>
                        </Box>
                    )}
                    <CardFooter />
                </>
            )}

            {activeButton === 'pending' && (
                <>
                    {pendingLoading ? (
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            textAlign="center"
                            py={5}
                        >
                            <Text color="white" fontSize="lg" mb={8}>
                                Loading pending reviews...
                            </Text>
                            <Spinner size={80} />
                        </Box>
                    ) : pendingError ? (
                        <Box textAlign="center" py={5}>
                            <Text color="red.500" fontSize="lg">
                                Error fetching pending reviews.
                            </Text>
                        </Box>
                    ) : pendingReviews?.length > 0 ? (
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
                                                    onClick={() =>
                                                        handlePendingReview(
                                                            review
                                                        )
                                                    }
                                                    colorScheme="green"
                                                    m={{ base: 4, md: 8 }}
                                                    width={{
                                                        base: 'full',
                                                        md: 'auto',
                                                    }}
                                                >
                                                    Review
                                                </Button>
                                            </Box>
                                        </Flex>
                                    </CardBody>
                                ))
                            )}
                        </Stack>
                    ) : (
                        <Box textAlign="center" py={5}>
                            <Text>No pending reviews available.</Text>
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
