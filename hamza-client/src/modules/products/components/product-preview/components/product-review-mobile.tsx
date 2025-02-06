import React, { useEffect, useState } from 'react';
import ReviewCardMobile from './review-card-mobile';
import { Text, Flex, Box } from '@chakra-ui/react';
import axios from 'axios';
import { getAllProductReviews } from '@/lib/server';

const fakeReviews = [
    {
        id: 1,
        name: 'Inpachem Reskweiat',
        location: 'Myanmar',
        review: 'I thought that this was a pretty good product, if a little bit less so that what the Lori Wymar article said; still and all though, I was satisfied. I think I might get another in a different color.',
        stars: 4,
    },
    {
        id: 2,
        name: 'Count Cagliostro',
        location: 'California',
        stars: 3,
        review: 'Bro, this was exactly what I was looking for when they said "you gotta get in on this thing"! I was all no, really? And then I was yeah I guess I should. All good!',
    },
    {
        id: 3,
        name: 'Clothar Magnusson',
        location: 'Iceland',
        stars: 4,
        review: 'Aside from all the lorem ipsum bulls**t, this product is actually the best one of its kind. If you think that it is not, let please teach you how to be a buff Icelandic giant. Plot twist: you gotta deadlift like every other day.',
    },
];
const ProductReviewMobile = ({ productId }: { productId: string }) => {
    const [reviews, setReviews] = useState<any>([]);
    const reviewDataFetcher = async () => {
        let res = await getAllProductReviews(productId);

        if (res) {
            setReviews([
                ...res.map((a: any) => {
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

        return;
    };

    useEffect(() => {
        console.log('product id changed on product review ', productId);
        if (productId) {
            reviewDataFetcher();
        }
    }, [productId]);
    return reviews.length > 0 ? (
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
    ) : (
        <div>
            <br />
            <Text color="white">This product has no reviews or ratings</Text>
            <br />
            <br />
        </div>
    );
};

export default ProductReviewMobile;
