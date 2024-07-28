'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useItemStore from '@store/review/review-store';
import { checkCustomerReviewExistence } from '@lib/data';
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

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

const EditReviewTemplate = ({ review: any, isOpen, onClose }) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    useEffect(() => {
        const fetchReviewDetails = async () => {
            console.log(
                `orderID is ${review?.order_id} and variantID is ${review?.variant_id}`
            );
            try {
                const response = await checkCustomerReviewExistence(
                    review.product_id,
                    review.order_id
                );
                const { content, rating } = response.data; // Assuming your backend returns review content and rating
                setReview(content || ''); // If content is null or undefined, set it to an empty string
                setRating(rating || 0); // If rating is null or undefined, set it to 0
            } catch (error) {
                alert('Failed to check review existence: ' + error);
            }
        };

        if (item) {
            fetchReviewDetails();
        }
    }, [item]);

    const submitReview = async () => {
        // console.log(
        //     `customer_id: ${item?.customer_id}, product_id: ${item?.variant_id}, rating: ${rating}, content: ${review}, order_id: ${item?.order_id}`
        // );
        try {
            await axios.post(`${BACKEND_URL}/custom/review/update`, {
                customer_id: item?.customer_id,
                product_id: item?.variant_id,
                ratingUpdates: rating,
                reviewUpdates: review,
                order_id: item?.order_id,
            });
            setReview('');
            setRating(0);
            setSubmissionSuccess(true); // Update the state to indicate success
        } catch (error) {
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Review</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {!submissionSuccess ? (
                        <>
                            <Box className="flex items-center mb-4">
                                <Image
                                    src={item?.thumbnail}
                                    alt={item?.title}
                                    boxSize="96px"
                                    mr="4"
                                />
                                <Box>
                                    <Text fontSize="xl" fontWeight="semibold">
                                        {item?.title}
                                    </Text>
                                    <Text
                                        dangerouslySetInnerHTML={{
                                            __html: item?.description ?? '',
                                        }}
                                    ></Text>
                                </Box>
                            </Box>
                            <Box>
                                <Box className="flex items-center mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
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
                                            onClick={() => {
                                                setRating(star);
                                                setHovered(star);
                                            }}
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
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                />
                            </Box>
                        </>
                    ) : (
                        <Text className="text-center p-4 text-green-500">
                            Review has been submitted successfully!
                        </Text>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={submitReview}
                        disabled={rating === 0 || review.trim() === ''}
                    >
                        Submit Review
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditReviewTemplate;
