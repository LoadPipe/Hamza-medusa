'use client';

import React, { useState } from 'react';
import {
    Box,
    Text,
    useDisclosure,
    ButtonGroup,
    Flex,
    Button,
    Image,
    Divider,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { getAllProductReviews, getNotReviewedOrders } from '@/lib/server';
import EditReviewTemplate from '@modules/editreview/[id]/edit-review-template';
import ReviewTemplate from '@modules/review/[id]/review-template';
import { useQueries } from '@tanstack/react-query';
import getQueryClient from '@/app/query-utils/getQueryClient';

import Spinner from '@modules/common/icons/spinner';

const commonButtonStyles = {
    borderRadius: '8px',
    width: '100%',
    maxWidth: '426px',
    height: '56px',
    padding: '16px',
    bg: 'gray.900',
    fontSize: '12px',
    fontWeight: 'semibold',
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
import Link from 'next/link';
import { renderStars } from '@modules/products/components/review-stars';
import { FaCheckCircle } from 'react-icons/fa';
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
    const customer_id = customer.id;

    // setup query client
    const queryClient = getQueryClient();

    const results = useQueries({
        queries: [
            {
                queryKey: ['pendingReviewsQuery', customer_id],
                queryFn: () => getNotReviewedOrders(customer_id),
            },
            {
                queryKey: ['reviewQuery', customer_id],
                queryFn: async () => getAllProductReviews(customer_id),
            },
        ],
    });

    // destructuring the results
    const [pendingReviewsQuery, reviewQuery] = results;

    const handleReviewUpdated = async () => {
        await queryClient.resetQueries(['reviewQuery', customer_id]);
        await queryClient.resetQueries(['homeProducts']);
        await queryClient.refetchQueries(['homeProducts']);
    };

    const handlePendingUpdated = async () => {
        await pendingReviewsQuery.refetch();
        await queryClient.resetQueries(['homeProducts']);
        await queryClient.refetchQueries(['homeProducts']);
    };

    const handleReviewEdit = (review: any) => {
        setSelectedReview(review);
        onEditReviewOpen();
    };

    const handlePendingReview = (review: any) => {
        setSelectedPendingReview(review);
        onReviewOpen();
    };

    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            color="white"
            width={'100%'}
        >
            <ButtonGroup
                width={'100%'}
                isAttached
                justifyContent="center"
                mb={4}
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
                <Flex
                    width={'100%'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    {reviewQuery.isLoading ? (
                        <Flex
                            flexDirection="column"
                            width={'100%'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            py={5}
                        >
                            <Text color="white" fontSize="lg" mb={8}>
                                Loading reviews...
                            </Text>
                            <Spinner size={80} />
                        </Flex>
                    ) : reviewQuery.isError ? (
                        <Flex textAlign="center" py={5}>
                            <Text color="red.500" fontSize="lg">
                                Error fetching reviews.
                            </Text>
                        </Flex>
                    ) : reviewQuery.data?.length > 0 ? (
                        <Flex direction={'column'} width="100%">
                            {reviewQuery.data.map((review: any) => (
                                <Flex
                                    flexDirection="column"
                                    width="100%"
                                    key={review.id}
                                >
                                    <Flex
                                        direction={'row'}
                                        fontSize={{
                                            base: '14px',
                                            md: '16px',
                                        }}
                                        pb={{ base: 2, md: 4 }}
                                        gap={2}
                                    >
                                        <Text as="span" color="#555555">
                                            Purchase Date:{' '}
                                        </Text>
                                        {format(
                                            new Date(review?.created_at),
                                            'PPP'
                                        )}
                                    </Flex>
                                    <Flex
                                        flexDirection={'row'}
                                        width="100%"
                                        gap={2}
                                    >
                                        <Link
                                            href={`/${process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'}/products/${review?.product?.handle}`}
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
                                                src={review?.product?.thumbnail}
                                            />
                                        </Link>
                                        <Text
                                            maxWidth="100%"
                                            flexWrap={'wrap'}
                                            fontSize={{
                                                base: '14px',
                                                md: '18px',
                                            }}
                                            fontWeight="bold"
                                            textTransform="uppercase"
                                        >
                                            {review.title}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        width={'100%'}
                                        mb={'16px'}
                                        flexDirection={{
                                            base: 'column',
                                            md: 'row',
                                        }}
                                    >
                                        <Flex
                                            width={'100%'}
                                            direction={{
                                                base: 'column',
                                                md: 'row',
                                            }}
                                        >
                                            <Text
                                                whiteSpace="nowrap"
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
                                                {renderStars(review?.rating)}
                                            </Text>
                                        </Flex>

                                        <Flex
                                            direction={{
                                                base: 'column',
                                                md: 'row',
                                            }}
                                            width={'100%'}
                                            mt={{ base: 4, md: 0 }}
                                        >
                                            {review.order_id && (
                                                <Button
                                                    variant="outline"
                                                    borderRadius="37px"
                                                    onClick={() =>
                                                        handleReviewEdit(review)
                                                    }
                                                    ml={{ base: 0, md: 'auto' }}
                                                    colorScheme="green"
                                                    width={{
                                                        base: 'full',
                                                        md: 'auto',
                                                    }}
                                                >
                                                    Update Review
                                                </Button>
                                            )}
                                        </Flex>
                                    </Flex>

                                    <Text
                                        width={'100%'}
                                        rounded="lg"
                                        fontSize={{
                                            base: '12px',
                                            md: 'sm',
                                        }}
                                        bg="black"
                                        p={'16px'}
                                    >
                                        {review.content}
                                    </Text>
                                    <Divider
                                        my={'20px'}
                                        width="100%" // Line takes up 90% of the screen width
                                        borderBottom="0.2px solid"
                                        borderColor="#D9D9D9"
                                        _last={{
                                            mb: 8,
                                        }}
                                    />
                                </Flex>
                            ))}
                        </Flex>
                    ) : (
                        <Flex textAlign="center" py={5}>
                            <Text>No reviews available.</Text>
                        </Flex>
                    )}
                </Flex>
            )}

            {activeButton === 'pending' && (
                <Flex
                    width={'100%'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    {pendingReviewsQuery.isLoading ? (
                        <Flex
                            width={'100%'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            flexDirection={'column'}
                            py={5}
                        >
                            <Text color="white" fontSize="lg" mb={8}>
                                Loading pending reviews...
                            </Text>
                            <Spinner size={80} />
                        </Flex>
                    ) : pendingReviewsQuery.isError ? (
                        <Flex textAlign="center" py={5}>
                            <Text color="red.500" fontSize="lg">
                                Error fetching pending reviews.
                            </Text>
                        </Flex>
                    ) : pendingReviewsQuery.data?.length > 0 ? (
                        <Flex direction={'column'} width="100%">
                            {pendingReviewsQuery.data.map((review: any) =>
                                review.items.map((item: any) => (
                                    <Flex
                                        flexDirection="column"
                                        width="100%"
                                        key={review.id}
                                    >
                                        <Flex
                                            flexDirection="row"
                                            fontSize={{
                                                base: '14px',
                                                md: '16px',
                                            }}
                                            pb={'16px'}
                                        >
                                            <Text
                                                fontSize={{
                                                    base: '14px',
                                                    md: '16px',
                                                }}
                                            >
                                                <Text as="span" color="#555555">
                                                    Purchase Date:{' '}
                                                </Text>
                                                {format(
                                                    new Date(review.created_at),
                                                    'PPP'
                                                )}
                                            </Text>
                                        </Flex>

                                        <Flex
                                            flexDirection={{
                                                base: 'column',
                                                md: 'row',
                                            }}
                                            width="100%"
                                            alignItems="center"
                                        >
                                            <Flex
                                                flexDirection={'row'}
                                                width="100%"
                                            >
                                                <Link
                                                    href={`/${process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'}/products/${item.variant.product.handle}`}
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
                                                        src={item?.thumbnail}
                                                        objectFit="cover"
                                                    />
                                                </Link>

                                                <Flex
                                                    flexDirection="column"
                                                    flex="1"
                                                    width="100%"
                                                    ml={'24px'}
                                                >
                                                    <Text
                                                        fontSize={{
                                                            base: '14px',
                                                            md: '18px',
                                                        }}
                                                        pb={'12px'}
                                                        fontWeight="bold"
                                                        textTransform="uppercase"
                                                        whiteSpace="normal" // Allow text to wrap
                                                        overflow="hidden" // Hide overflowed text
                                                        textOverflow="ellipsis" // Add ellipsis for overflow
                                                        textAlign="left" // Ensure title aligns properly with the variation
                                                        width="100%" // Ensure title takes up full available width
                                                    >
                                                        {item?.title}
                                                    </Text>
                                                    <Flex
                                                        direction="row"
                                                        color="rgba(85, 85, 85, 1.0)"
                                                        alignItems="center"
                                                        gap={2}
                                                    >
                                                        <Text
                                                            fontSize="16px"
                                                            mr={1}
                                                        >
                                                            Variation:
                                                        </Text>
                                                        <Text
                                                            fontSize="16px"
                                                            noOfLines={2}
                                                        >
                                                            {item?.description}
                                                        </Text>
                                                    </Flex>
                                                </Flex>
                                            </Flex>

                                            <Flex
                                                flexDirection="column"
                                                width="100%"
                                                justifyContent="flex-end"
                                            >
                                                <Flex
                                                    ml="auto"
                                                    flexDirection="row"
                                                    alignItems="center"
                                                    gap={1.5}
                                                    width="100%"
                                                    justifyContent={{
                                                        md: 'flex-end',
                                                    }}
                                                    mt={{ base: '16px', md: 0 }}
                                                >
                                                    <Link
                                                        href={`/${process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'}/store/${review?.store?.name}`}
                                                    >
                                                        <Image
                                                            src={
                                                                review?.store
                                                                    ?.icon
                                                            }
                                                            alt="Light Logo"
                                                            boxSize="32px"
                                                            borderRadius="full"
                                                        />
                                                    </Link>
                                                    <Text
                                                        fontSize={{
                                                            base: '18px',
                                                            md: '24px',
                                                        }}
                                                        fontWeight="bold"
                                                        noOfLines={1}
                                                        mr={{
                                                            sm: '5px',
                                                            md: '10px',
                                                        }}
                                                    >
                                                        {review?.store?.name}
                                                    </Text>
                                                    <FaCheckCircle color="#3196DF" />
                                                </Flex>

                                                <Flex
                                                    flexDirection={{
                                                        base: 'column',
                                                        md: 'row',
                                                    }}
                                                    width="100%"
                                                    mt="16px"
                                                >
                                                    <Button
                                                        mr="24px"
                                                        onClick={() =>
                                                            handlePendingReview(
                                                                review
                                                            )
                                                        }
                                                        variant="outline"
                                                        ml={{
                                                            base: 0,
                                                            md: 'auto',
                                                        }}
                                                        colorScheme="white"
                                                        borderRadius="37px"
                                                        cursor="pointer"
                                                        _hover={{
                                                            textDecoration:
                                                                'underline',
                                                        }}
                                                        width={{
                                                            base: 'full',
                                                            md: '207px',
                                                        }}
                                                    >
                                                        Review This Product
                                                    </Button>
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                        <Divider
                                            my={'20px'}
                                            width="100%" // Line takes up 90% of the screen width
                                            borderBottom="0.2px solid"
                                            borderColor="#D9D9D9"
                                            _last={{
                                                mb: 8,
                                            }}
                                        />
                                    </Flex>
                                ))
                            )}
                        </Flex>
                    ) : (
                        <Box textAlign="center" py={5}>
                            <Text>No pending reviews available.</Text>
                        </Box>
                    )}
                </Flex>
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
        </Flex>
    );
};

export default ReviewPage;
