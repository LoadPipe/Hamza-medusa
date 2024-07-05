import React, { useEffect, useState } from 'react';
import ReviewCardMobile from './review-card-mobile';
import { Text, Flex, Box } from '@chakra-ui/react';
import axios from 'axios';

const fakeReviews = [
    {
        id: 1,
        name: 'John Doe',
        location: 'New York',
        review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        stars: 4,
    },
    {
        id: 2,
        name: 'Jane Smith',
        location: 'California',
        stars: 4,
        review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        id: 3,
        name: 'Alice Johnson',
        location: 'Texas',
        stars: 4,
        review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
];
const ProductReviewMobile = ({ productId }: { productId: string }) => {
    const [reviews, setReviews] = useState<any>([]);
    const reviewDataFetcher = async () => {
        let res = await axios.post(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/custom/review/all-reviews`,
            {
                product_id: productId,
            }
        );

        if (res.data) {
            if (res.data.length < 6) {
                setReviews([
                    ...fakeReviews,
                    ...res.data.map((a: any) => {
                        return {
                            id: a.id,
                            name:
                                `${a.customer.first_name} ${a.customer.last_name}` ||
                                'Anonymous Customer',
                            location: 'US',
                            review: a.content,
                            stars: a.rating,
                        };
                    }),
                ]);
            } else {
                setReviews([
                    ...res.data.map((a: any) => {
                        return {
                            id: a.id,
                            name:
                                `${a.customer.first_name} ${a.customer.last_name}` ||
                                'Anonymous Customer',
                            location: 'US',
                            review: a.content,
                            stars: a.rating,
                        };
                    }),
                ]);
            }
        }

        return;
    };

    useEffect(() => {
        console.log('product id changed on product review ', productId);
        if (productId) {
            reviewDataFetcher();
        }
    }, [productId]);
    return (
        <Flex
            maxW="1280px"
            width={'100%'}
            height="450.57px"
            display={{ base: 'flex', md: 'none' }}
            overflow={'hidden'}
            overflowX="scroll"
        >
            <Flex flexDirection={'column'} my="2rem">
                <Flex mt="2rem" flexDirection="row" gap="26px">
                    {reviews.map((review: any) => {
                        if (review) {
                            return (
                                <ReviewCardMobile
                                    key={review.id}
                                    name={review.name}
                                    location={review.location}
                                    review={review.review}
                                    stars={review.stars}
                                />
                            );
                        }
                    })}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default ProductReviewMobile;
