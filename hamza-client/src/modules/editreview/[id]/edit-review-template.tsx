'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useItemStore from '@store/review/review-store';
import { Button } from '@medusajs/ui';

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

const EditReviewTemplate = () => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const item = useItemStore((state) => state.item);
    // TODO: Pass Variant_ID and Order_ID to useEffect, if item exists, then populate the placeholder for the review details
    // console.log(`item info ${JSON.stringify(item)}`);
    useEffect(() => {
        const fetchReviewDetails = async () => {
            console.log(
                `orderID is ${item?.order_id} and variantID is ${item?.variant_id}`
            );
            try {
                const response = await axios.get(
                    `${BACKEND_URL}/custom/review/existing`,
                    {
                        params: {
                            variant_id: item?.variant_id,
                            order_id: item?.order_id,
                        },
                    }
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
        <div className="p-4 bg-white shadow-md rounded-lg text-black">
            {!submissionSuccess ? (
                <>
                    <div className="flex items-center mb-4">
                        <img
                            src={item?.thumbnail}
                            alt={item?.title}
                            className="w-24 h-24 mr-4"
                        />
                        <div>
                            <h1 className="text-xl font-semibold">
                                {item?.title}
                            </h1>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: item?.description ?? '',
                                }}
                            ></p>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className={`text-2xl ${star <= (hovered || rating) ? 'text-yellow-500' : 'text-gray-400'}`}
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
                        </div>
                        <p className="text-black">Review Detail</p>
                        <textarea
                            className="w-full p-2 border rounded text-black"
                            rows={4}
                            placeholder="What do you think of this product?"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />
                        <Button
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={submitReview}
                            disabled={rating === 0 || review.trim() === ''}
                        >
                            Submit Review
                        </Button>
                    </div>
                </>
            ) : (
                <div className="text-center p-4">
                    <p className="text-green-500">
                        Review has been submitted successfully!
                    </p>
                </div>
            )}
        </div>
    );
};

export default EditReviewTemplate;
