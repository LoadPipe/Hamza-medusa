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
    Flex,
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
import Link from 'next/link';

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
    const [activeButton, setActiveButton] = useState('pending');
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
            width={{ base: '100%', sm: '400px', md: '700px', lg: '900px' }}
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
                    <Stack divider={<StackDivider />} spacing={4}>
                        {reviews.map((review: any) => (
                            <CardBody key={review.id}>
                                <Flex
                                    direction={{ base: 'column', md: 'row' }}
                                    justify="space-between"
                                    align="flex-start" // Adjust alignment for better vertical alignment
                                    gap={4}
                                >
                                    {/* Combined Content Column */}
                                    <Box flex="1" pr={{ base: 0, md: 4 }}>
                                        <Text
                                            fontSize={{
                                                base: '14px',
                                                md: '16px',
                                            }}
                                            pb={4}
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
                                            <Image
                                                rounded={'lg'}
                                                width={{
                                                    base: '50px',
                                                    md: '72px',
                                                }}
                                                height={{
                                                    base: '50px',
                                                    md: '72px',
                                                }}
                                                src={review.product.thumbnail}
                                            />
                                            <Text
                                                maxWidth={{
                                                    base: '300px',
                                                    md: '500px',
                                                }}
                                                fontSize={{
                                                    base: '14px',
                                                    md: '18px',
                                                }}
                                                fontWeight={'bold'}
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
                                            Your Product rating & review:
                                        </Text>
                                        <Text
                                            p={2}
                                            fontSize={{
                                                base: '12px',
                                                md: 'sm',
                                            }}
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
                                                m={4}
                                                onClick={() =>
                                                    handleReviewEdit(review)
                                                }
                                                colorScheme="green"
                                                width={{
                                                    base: 'full',
                                                    md: 'auto',
                                                }} // Full width on smaller screens
                                            >
                                                Edit
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
                                            direction="row"
                                            justify="space-between"
                                            align="center"
                                        >
                                            {/* Left Column */}
                                            <Box flex="1" pr={4}>
                                                <Text fontSize="16px" pb={8}>
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
                                                    flexDir="row"
                                                    alignItems="center"
                                                    gap={2}
                                                >
                                                    <Link
                                                        href={`/us/products/${item.variant.product.handle}`}
                                                    >
                                                        <Image
                                                            rounded={'lg'}
                                                            width={'72px'}
                                                            height={'72px'}
                                                            src={item.thumbnail}
                                                        />
                                                    </Link>
                                                    <Text
                                                        fontSize={'18px'}
                                                        maxWidth={'500px'}
                                                        fontWeight={'bold'}
                                                        textTransform="uppercase"
                                                    >
                                                        {item.title}
                                                    </Text>
                                                </Flex>
                                            </Box>
                                            {/* Right Column */}
                                            <Box>
                                                <Button
                                                    onClick={() =>
                                                        handlePendingReview(
                                                            review
                                                        )
                                                    }
                                                    colorScheme="green"
                                                    m={8}
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
