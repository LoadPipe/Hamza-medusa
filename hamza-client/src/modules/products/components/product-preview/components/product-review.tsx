import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import ReviewCard from './review-card';
import ReviewCardMobile from './review-card-mobile';
import ReviewStar from '../../../../../../public/images/products/review-star.svg';
import Image from 'next/image';
import axios from 'axios';
import useProductPreview from '@store/product-preview/product-preview';

const ProductReview = () => {
    const [startIndex, setStartIndex] = useState(0);
    const reviewsToShow = 2;
    const { productId } = useProductPreview();

    const [fakeReviews, setFakeReviews] = useState(true);
    const [reviews, setReviews] = useState([
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
    ]);

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

        if (res.data && res.data.length > 0) {
            setReviews(
                res.data.map((a: any) => {
                    return {
                        id: a.id,
                        name:
                            `${a.customer.first_name} ${a.customer.last_name}` ||
                            'Anonymous Customer',
                        location: 'US',
                        review: a.content,
                        stars: a.rating,
                    };
                })
            );
            setFakeReviews(false);
        }

        return;
    };

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
                        {fakeReviews == true
                            ? '4.96 - 312 Reviews'
                            : `${reviews.reduce((a, b) => a + b.stars, 0) / reviews.length} - ${reviews.length} Reviews`}
                    </Text>
                    <Flex mt="2rem" flexDirection="row" gap="26px">
                        {displayedReviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                name={review.name}
                                location={review.location}
                                review={review.review}
                                stars={review.stars}
                            />
                        ))}
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
