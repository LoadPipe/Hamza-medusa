'use client';

import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Box,
    Button,
    Image,
    Text,
    Flex,
} from '@chakra-ui/react';
import { updateProductReview } from '@lib/data';
import toast from 'react-hot-toast';

const EditReviewTemplate = ({
    review,
    isOpen,
    onClose,
    onReviewUpdated,
}: any) => {
    const [currentReview, setCurrentReview] = useState(review.content || '');
    const [rating, setRating] = useState(review.rating || 0);
    const [hovered, setHovered] = useState(0);

    useEffect(() => {
        if (
            review &&
            (review.content !== currentReview || review.rating !== rating)
        ) {
            setCurrentReview(review.content || '');
            setRating(review.rating || 0);
        }
    }, [review]);

    const submitReview = async () => {
        const data = {
            product_id: review.product_id,
            content: currentReview,
            rating: Number(rating),
            customer_id: review.customer_id,
            order_id: review.order_id,
        };

        try {
            const response = await updateProductReview(
                data.product_id,
                data.content,
                data.rating,
                data.customer_id,
                data.order_id
            );

            setCurrentReview('');
            setRating(0);
            if (response) {
                toast.success('Review Updated Successfully!');

                if (onReviewUpdated) {
                    onReviewUpdated({
                        ...review,
                        content: currentReview,
                        rating: Number(rating),
                    });
                }
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
                <ModalHeader color={'primary.green.900'} textAlign={'center'}>
                    Edit Your Review
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box className="flex items-center mb-4">
                        <Image
                            src={review.product.thumbnail}
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
                            value={currentReview}
                            onChange={(e) => setCurrentReview(e.target.value)}
                        />
                        {currentReview.trim().length < 50 && (
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
                                variant="solid"
                                backgroundColor={'transparent'}
                                color={'primary.indigo.900'}
                                border={'2px solid'} // Set the border width and style
                                borderColor={'primary.indigo.900'} // Set the border color to indigo
                                width={'180px'}
                                height={'47px'}
                                borderRadius={'full'}
                                onClick={() => {
                                    onClose();
                                    setRating(0);
                                    setCurrentReview('');
                                }}
                            >
                                Cancel
                            </Button>

                            <Box
                                as="button"
                                borderRadius={'37px'}
                                backgroundColor={
                                    rating === 0 ||
                                    currentReview.trim().length < 50
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
                                disabled={
                                    rating === 0 ||
                                    currentReview.trim().length < 50
                                }
                            >
                                Submit
                            </Box>
                        </Flex>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditReviewTemplate;
