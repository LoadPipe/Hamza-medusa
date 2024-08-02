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

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

const EditReviewTemplate = ({ review, isOpen, onClose }) => {
    const [currentReview, setCurrentReview] = useState(review.content || '');
    const [rating, setRating] = useState(review.rating || 0);
    const [hovered, setHovered] = useState(0);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    useEffect(() => {
        // No need to fetch details if they are already passed as props
        console.log(`Review issss?D: ${JSON.stringify(review)}`);
        setRating(review.rating);
    }, [review]);

    const submitReview = async () => {
        try {
            // Ensure that the parameters are passed in the correct order as expected by the updateProductReview function
            const response = await updateProductReview(
                review.product_id, // product_id
                currentReview, // review
                rating, // rating
                review.customer_id, // customer_id
                review.order_id // order_id
            );

            if (response) {
                setCurrentReview('');
                setRating(0);
                setSubmissionSuccess(true); // Update the state to indicate success
                console.log('Review updated successfully');
            } else {
                console.error('Failed to update review');
                alert('Failed to update review');
            }
        } catch (error) {
            console.error('Failed to submit review: ', error);
            alert('Failed to submit review: ' + error);
        }
    };

    const ratingDescriptions = [
        'Extremely Bad',
        'Dissatisfied',
        'Fair',
        'Satisfied',
        'Delighted',
    ];

    // Modifying this ternary is very easy, probably should do that, but
    // first we need to find out wtf is going on with this `Update Review` button
    // why does the star MAPPING keep showing 4/5 stars, how is it being passed/?????
    // FOUND IT, ok....
    /**
     * 1. The Star is ONLY being updated on page RENDER!
     * **/
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Your Review</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {!submissionSuccess ? (
                        <>
                            <Box className="flex items-center mb-4">
                                <Image
                                    src={review.thumbnail}
                                    alt={review.title}
                                    boxSize="96px"
                                    mr="4"
                                />
                                <Box>
                                    <Text fontSize="xl" fontWeight="semibold">
                                        {review.title}
                                    </Text>
                                    <Text
                                        dangerouslySetInnerHTML={{
                                            __html: review.description || '',
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
                                            onMouseLeave={() => setHovered(0)}
                                        >
                                            ★
                                        </Button>
                                    ))}
                                    <Text
                                        ml="2"
                                        fontSize="sm"
                                        fontWeight="medium"
                                    >
                                        {ratingDescriptions[rating - 1] || ''}
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
                    ) : (
                        <Text className="text-center p-4 text-green-500">
                            Review has been submitted successfully!
                        </Text>
                    )}
                </ModalBody>
                <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={submitReview}
                    disabled={rating === 0 || currentReview.trim() === ''}
                >
                    Submit Review
                </Button>
                <Button variant="ghost" onClick={onClose}>
                    Close
                </Button>
            </ModalContent>
        </Modal>
    );
};

export default EditReviewTemplate;
