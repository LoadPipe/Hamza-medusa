import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import ReviewCard, { renderStars } from './review-card';
import ReviewCardMobile from './review-card-mobile';
import ReviewStar from '../../../../../../public/images/products/review-star.svg';
import Image from 'next/image';
import axios from 'axios';
import {
    TiStarFullOutline,
    TiStarHalfOutline,
    TiStarOutline,
} from 'react-icons/ti';

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

const ProductReview = ({ productId }: { productId: string }) => {
    const [startIndex, setStartIndex] = useState(0);
    const reviewsToShow = 2;

    const [reviews, setReviews] = useState<any>([]);

    const handleNext = () => {
        setStartIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    };

    const handlePrev = () => {
        setStartIndex(
            (prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length
        );
    };

    const displayedReviews = [
        reviews[startIndex],
        reviews[(startIndex + 1) % reviews.length],
    ];

    const reviewDataFetcher = async () => {
        let res = await axios.post(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/custom/review/all-reviews`,
            {
                product_id: productId,
            }
        );
        if (res.data) {
            if (res.data.length < 2) {
                console.log('setting ', [
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

    console.log('product reviews are ', reviews);
    useEffect(() => {
        if (productId) {
            reviewDataFetcher();
        }
    }, [productId]);
    return (
        <Flex
            maxW="1280px"
            my="2rem"
            width={'100%'}
            height="450.57px"
            display={{ base: 'none', md: 'flex' }}
            overflow={'hidden'}
        >
            <Flex
                background="linear-gradient(317.5deg, #53594A 42.03%, #2C272D 117.46%, #2C272D 117.46%)"
                width="100%"
                height="100%"
                justifyContent={'center'}
                borderRadius={'16px'}
            >
                <Flex
                    mr="auto"
                    alignSelf={'center'}
                    height="100%"
                    px="1.5rem"
                    cursor={'pointer'}
                    onClick={handlePrev}
                >
                    <Flex alignSelf={'center'}>
                        <GoArrowLeft color="white" size={36} />
                    </Flex>
                </Flex>

                <Flex flexDirection={'column'} my="auto" overflow={'hidden'}>
                    <Text fontSize={'32px'} fontWeight={'bold'} color="white">
                        {reviews.length > 0 && (
                            <>
                                {renderStars(
                                    reviews.reduce(
                                        (a: any, b: any) => a + b.stars,
                                        0
                                    ) / reviews.length
                                )}{' '}
                                {reviews.length} Reviews
                            </>
                        )}
                    </Text>
                    <Flex mt="2rem" flexDirection="row" gap="26px">
                        {displayedReviews.map((review) => {
                            if (review) {
                                return (
                                    <ReviewCard
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

                <Flex
                    ml="auto"
                    alignSelf={'center'}
                    height="100%"
                    px="1.5rem"
                    cursor={'pointer'}
                    onClick={handleNext}
                >
                    <Flex alignSelf={'center'}>
                        <GoArrowRight color="white" size={36} />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default ProductReview;
