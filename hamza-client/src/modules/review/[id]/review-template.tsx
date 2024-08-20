'use client';

import React, { useState, useEffect } from 'react';
import useItemStore from '@store/review/review-store';
import { createReview, checkReviewsExistence } from '@lib/data';
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

const ReviewTemplate = ({ reviewItem, isOpen, onClose }: any) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [canSubmit, setCanSubmit] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    console.log(
        `reviewItem description ${JSON.stringify(reviewItem.cart.items[0]?.variant?.product?.thumbnail)}`
    );

    const submitReview = async () => {
        if (canSubmit) {
            alert('Review already exists for this order.');
            return;
        }

        const data = {
            customer_id: review?.customer_id,
            product_id: review?.variant_id,
            rating: rating,
            content: review,
            title: 'Review for ' + review?.title, // Assuming a title is needed
            order_id: review?.order_id,
        };

        try {
            await createReview(data);
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
                {!submissionSuccess ? (
                    <>
                        <ModalHeader
                            color={'primary.green.900'}
                            justifyContent={'center'}
                            alignContent={'center'}
                        >
                            Add A Review
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box className="flex items-center mb-4">
                                <Image
                                    src={
                                        reviewItem.cart.items[0]?.variant
                                            ?.product?.thumbnail
                                    }
                                    alt={
                                        reviewItem.cart.items[0]?.variant
                                            ?.product?.title
                                    }
                                    className="w-24 h-24 mr-4"
                                />
                                <Box>
                                    <h1 className="text-xl font-semibold">
                                        {
                                            reviewItem.cart.items[0]?.variant
                                                ?.product?.title
                                        }
                                    </h1>
                                    {/*<p*/}
                                    {/*    dangerouslySetInnerHTML={{*/}
                                    {/*        __html:*/}
                                    {/*            reviewItem.cart.items[0]*/}
                                    {/*                ?.variant?.product*/}
                                    {/*                ?.description ?? '',*/}
                                    {/*    }}*/}
                                    {/*></p>*/}
                                </Box>
                            </Box>
                            <Box>
                                <Box className="flex items-center mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            className={`text-2xl ${star <= (hovered || rating) ? 'text-yellow-500' : 'text-gray-400'}`}
                                            onMouseEnter={() =>
                                                setHovered(star)
                                            }
                                            onMouseLeave={() => setHovered(0)}
                                            onClick={() => {
                                                setRating(star);
                                                setHovered(star);
                                            }}
                                        >
                                            ★
                                        </button>
                                    ))}
                                    <span className="ml-2 text-sm font-medium text-black self-center">
                                        {ratingDescriptions[rating - 1] || ''}
                                    </span>
                                </Box>
                                <p className="text-black">Review Detail</p>
                                <textarea
                                    className="w-full p-2 border rounded text-black"
                                    rows={4}
                                    placeholder="What do you think of this product?"
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                />
                                <Button
                                    variant="solid"
                                    borderColor={'primary.indigo.900'}
                                    color={'primary.indigo.900'}
                                    width={'180px'}
                                    borderRadius={'37px'}
                                    onClick={() => {
                                        onClose();
                                        setRating(0);
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    variant="solid"
                                    backgroundColor={'primary.indigo.900'}
                                    color={'white'}
                                    borderRadius={'37px'}
                                    ml={'20px'}
                                    width={'180px'}
                                    onClick={submitReview}
                                    disabled={
                                        rating === 0 || review.trim() === ''
                                    }
                                >
                                    Submit
                                </Button>
                            </Box>
                        </ModalBody>
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
            </ModalContent>
        </Modal>
    );
};

export default ReviewTemplate;
