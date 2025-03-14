'use client';

import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Image,
    Text,
    Box,
    Flex,
} from '@chakra-ui/react';
import { createReview, getVerificationStatus } from '@/lib/server';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

const ReviewTemplate = ({
    reviewItem,
    isOpen,
    onClose,
    onPendingReviewUpdated,
}: any) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);

    const {
        data: verificationStatus,
        error: verificationError,
        isLoading: verificationStatusLoading,
    } = useQuery({
        queryKey: ['verificationStatus', reviewItem?.customer_id],
        queryFn: async () => {
            try {
                const status = await getVerificationStatus(
                    reviewItem?.customer_id
                );
                return status.data;
            } catch (err) {
                console.error('Error getting verification status.');
                return null;
            }
        },
        enabled: !!reviewItem?.customer_id,
        staleTime: 5 * 60 * 1000,
    });

    const submitReview = async () => {
        const data = {
            customer_id: reviewItem?.customer_id,
            product_id: reviewItem.items[0].variant.product.id,
            rating: rating,
            content: review,
            title: 'Review for ' + reviewItem.items[0].title,
            order_id: reviewItem?.id,
        };

        try {
            const response = await createReview(data);
            setReview('');
            setRating(0);
            if (response) {
                toast.success('Review Submitted!', {});
                onPendingReviewUpdated();
                onClose();
            }
        } catch (error) {
            toast.error('Failed to submit Review.');
        }
    };

    const ratingDescriptions = [
        'Extremely Bad',
        'Dissatisfied',
        'Fair',
        'Satisfied',
        'Delighted',
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bg={'#121212'}>
                <ModalHeader
                    color={'primary.green.900'}
                    justifyContent={'center'}
                    alignContent={'center'}
                >
                    Add A Review
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    {!verificationStatus && (
                        <Box
                            mb={4}
                            p={4}
                            bg="#1A1A1A"
                            borderRadius="md"
                            color="white"
                        >
                            <Text>
                                Verify your email to share your feedback!
                                Reviews are available only to verified users.
                                Please check your inbox and confirm your email
                                to start reviewing products.
                            </Text>
                            <Text
                                mt={2}
                                color="primary.green.900"
                                fontWeight="bold"
                                cursor="pointer"
                            >
                                <Link href="/account/verify">Verify Now</Link>
                            </Text>
                        </Box>
                    )}
                    <Box color={'white'} className="flex items-center mb-4">
                        <Image
                            src={reviewItem.items[0].thumbnail}
                            alt={reviewItem.items[0].title}
                            className="w-24 h-24 mr-4"
                        />
                        <Box>
                            <h1
                                className={`text-xl font-semibold ${!verificationStatus ? 'text-gray-500' : ''}`}
                            >
                                {reviewItem.items[0].title}
                            </h1>
                        </Box>
                    </Box>
                    <Box>
                        <Box className="flex items-center mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className={`text-2xl ${
                                        star <= (hovered || rating)
                                            ? 'text-yellow-500'
                                            : 'text-gray-400'
                                    }`}
                                    onMouseEnter={() => setHovered(star)}
                                    onMouseLeave={() => setHovered(0)}
                                    onClick={() => {
                                        setRating(star);
                                        setHovered(star);
                                    }}
                                    disabled={!verificationStatus}
                                >
                                    ★
                                </button>
                            ))}
                            <span className="ml-2 text-sm font-medium text-white self-center">
                                {ratingDescriptions[rating - 1] || ''}
                            </span>
                        </Box>
                        <p
                            className={`${!verificationStatus ? 'text-gray-500' : 'text-white '}`}
                        >
                            Review Detail
                        </p>
                        <textarea
                            className="w-full p-2  rounded text-white bg-black"
                            rows={4}
                            style={{ resize: 'none' }}
                            placeholder="What do you think of this product?"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            disabled={!verificationStatus}
                        />
                        {review.trim().length < 50 && (
                            <Text color="red.500" fontSize="sm" mt={2}>
                                Review must be at least 50 characters long.
                            </Text>
                        )}
                        <Flex
                            flexDirection="row"
                            justifyContent="center"
                            alignItems="center"
                            my={'1rem'}
                        >
                            <Button
                                backgroundColor={
                                    verificationStatus ? 'gray.800' : 'gray.600'
                                }
                                borderColor={
                                    verificationStatus
                                        ? 'primary.indigo.900'
                                        : 'gray.600'
                                }
                                color={
                                    verificationStatus ? 'gray.600' : 'gray.300'
                                }
                                width={'180px'}
                                height={'47px'}
                                borderRadius={'37px'}
                                onClick={() => {
                                    onClose();
                                    setRating(0);
                                    setReview('');
                                }}
                                disabled={!verificationStatus}
                            >
                                Cancel
                            </Button>

                            <Button
                                borderRadius={'37px'}
                                alignItems="center"
                                backgroundColor={
                                    verificationStatus
                                        ? 'primary.indigo.900'
                                        : 'gray.600'
                                }
                                borderColor={
                                    verificationStatus
                                        ? 'primary.indigo.900'
                                        : 'gray.600'
                                }
                                color={
                                    verificationStatus ? 'white' : 'gray.300'
                                }
                                fontSize={'18px'}
                                fontWeight={600}
                                height={'47px'}
                                width={'180px'}
                                ml={'20px'}
                                onClick={submitReview}
                                disabled={
                                    verificationStatus
                                        ? rating === 0 ||
                                          review.trim().length < 50
                                        : true
                                }
                            >
                                Submit
                            </Button>
                        </Flex>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ReviewTemplate;
