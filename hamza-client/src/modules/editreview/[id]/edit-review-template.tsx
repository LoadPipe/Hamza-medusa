'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@chakra-ui/react';
import { updateProductReview } from '@lib/data';
import toast from 'react-hot-toast';

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

// TODO: WHEN TO TRIGGER getAllProductReviews? 1. Initial load 2. Set new Review
// Why can't we set isOpen: boolean?
const EditReviewTemplate = ({ review, isOpen, onClose }: any) => {
    const [currentReview, setCurrentReview] = useState(review.content || '');
    const [rating, setRating] = useState(review.rating || 0);
    const [hovered, setHovered] = useState(0);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    useEffect(() => {
        // No need to fetch details if they are already passed as props
        console.log(`Review issss?D: ${JSON.stringify(review)}`);
        setRating(review.rating);
    }, [review]);

    console.log(`Review edit page ${JSON.stringify(review)}`);

    const submitReview = async () => {
        try {
            const response = await updateProductReview(
                review.product_id,
                currentReview,
                rating,
                review.customer_id,
                review.order_id
            );

            if (response.status === 200) {
                setCurrentReview('');
                setRating(0);
                toast.success('Review Submitted!', {});
                onClose();
                console.log('Review updated successfully');
            } else {
                console.error('Failed to update review');
                toast.error('Failed to submit Review.');
            }
        } catch (error) {
            console.error('Failed to submit review: ', error);
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

    // TODO: Seems like once we if(response).... is setting all the other reviews to 0 star....
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                {!submissionSuccess ? (
                    <>
                        <ModalHeader>Edit Your Review</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <>
                                <Box className="flex items-center mb-4">
                                    <Image
                                        src={review.product.thumbnail}
                                        alt={review.title}
                                        boxSize="96px"
                                        mr="4"
                                    />
                                    <Box>
                                        <Text
                                            fontSize="xl"
                                            fontWeight="semibold"
                                        >
                                            {review.title}
                                        </Text>
                                        <Text
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    review.description || '',
                                            }}
                                        ></Text>
                                    </Box>
                                </Box>
                                <Box>
                                    <Box className="flex items-center mb-2">
                                        {[1, 2, 3, 4, 5].map((star: number) => (
                                            <Button
                                                key={star}
                                                size="lg"
                                                variant={
                                                    star <= (hovered || rating)
                                                        ? 'solid'
                                                        : 'ghost'
                                                }
                                                colorScheme={
                                                    star <= (hovered || rating)
                                                        ? 'yellow'
                                                        : 'gray'
                                                }
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() =>
                                                    setHovered(star)
                                                }
                                                onMouseLeave={() =>
                                                    setHovered(0)
                                                }
                                            >
                                                ★
                                            </Button>
                                        ))}
                                        <Text
                                            ml="2"
                                            fontSize="sm"
                                            fontWeight="medium"
                                        >
                                            {ratingDescriptions[rating - 1] ||
                                                ''}
                                        </Text>
                                    </Box>
                                    <Text fontSize="md" fontWeight="bold">
                                        Review Detail
                                    </Text>
                                    <textarea
                                        className="w-full p-2 border rounded text-black"
                                        rows={4}
                                        placeholder="What do you think of this product?"
                                        value={currentReview}
                                        onChange={(e) =>
                                            setCurrentReview(e.target.value)
                                        }
                                    />
                                </Box>
                            </>
                        </ModalBody>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={submitReview}
                            disabled={
                                rating === 0 || currentReview.trim() === ''
                            }
                        >
                            Submit Review
                        </Button>
                    </>
                ) : (
                    <>
                        <ModalHeader>Your Review has been Updated</ModalHeader>
                        <ModalCloseButton />
                        <Text className="text-center p-4 text-green-500">
                            Review has been submitted successfully!
                        </Text>
                    </>
                )}
                <Button variant="ghost" onClick={onClose}>
                    Close
                </Button>
            </ModalContent>
        </Modal>
    );
};

export default EditReviewTemplate;
