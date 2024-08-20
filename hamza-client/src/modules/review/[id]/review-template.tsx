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
} from '@chakra-ui/react';
import { createReview } from '@lib/data';
import toast from 'react-hot-toast';

const ReviewTemplate = ({ reviewItem, isOpen, onClose }: any) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);

    const submitReview = async () => {
        const data = {
            customer_id: reviewItem?.customer_id,
            product_id: reviewItem.cart.items[0]?.variant?.product.id,
            rating: rating,
            content: review,
            title:
                'Review for ' +
                reviewItem.cart.items[0]?.variant?.product?.title,
            order_id: reviewItem?.id,
        };

        try {
            const response = await createReview(data);
            setReview('');
            setRating(0);
            if (response.status === 200) {
                toast.success('Review Submitted!', {});
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
            <ModalContent>
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
                                reviewItem.cart.items[0]?.variant?.product
                                    ?.thumbnail
                            }
                            alt={
                                reviewItem.cart.items[0]?.variant?.product
                                    ?.title
                            }
                            className="w-24 h-24 mr-4"
                        />
                        <Box>
                            <h1 className="text-xl font-semibold">
                                {
                                    reviewItem.cart.items[0]?.variant?.product
                                        ?.title
                                }
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
                        {review.trim().length < 100 && (
                            <Text color="red.500" fontSize="sm" mt={2}>
                                Review must be at least 50 characters long.
                            </Text>
                        )}
                        <Button
                            variant="solid"
                            borderColor={'primary.indigo.900'}
                            color={'primary.indigo.900'}
                            width={'180px'}
                            height={'47px'}
                            borderRadius={'37px'}
                            onClick={() => {
                                onClose();
                                setRating(0);
                                setReview('');
                            }}
                        >
                            Cancel
                        </Button>

                        <Box
                            as="button"
                            mt={4}
                            borderRadius={'37px'}
                            backgroundColor={
                                rating === 0 || review.trim().length < 50
                                    ? 'gray.400'
                                    : 'primary.indigo.900'
                            }
                            color={'white'}
                            fontSize={'18px'}
                            fontWeight={600}
                            height={'47px'}
                            width={'180px'}
                            ml={'20px'}
                            onClick={submitReview}
                            disabled={rating === 0 || review.trim().length < 50}
                        >
                            Submit
                        </Box>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ReviewTemplate;
