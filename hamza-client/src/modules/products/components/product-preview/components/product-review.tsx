import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import ReviewCard from './review-card';

import { allReviews } from '@/lib/server';
import { renderStars } from '../../review-stars';
import useProductPreview from '@/zustand/product-preview/product-preview';

const ProductReview = () => {
    const [startIndex, setStartIndex] = useState(0);
    const reviewsToShow = 2;
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { productId } = useProductPreview();

    const handleNext = () => {
        if (reviews.length > 2) {
            setStartIndex((prevIndex) => (prevIndex + 1) % reviews.length);
        }
    };

    const handlePrev = () => {
        if (reviews.length > 2) {
            setStartIndex(
                (prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length
            );
        }
    };

    const displayedReviews = reviews.slice(
        startIndex,
        startIndex + reviewsToShow
    );

    useEffect(() => {
        console.log('Product ID:', productId); // Check if productId is valid

        if (!productId) {
            return;
        }
        const fetchReviews = async () => {
            try {
                let res = await allReviews(productId);
                console.log('Fetched Reviews:', res); // Log to ensure data is correct

                if (res) {
                    setReviews(
                        res.map((a: any) => ({
                            id: a.id,
                            name:
                                `${a.customer.first_name} ${a.customer.last_name}` ||
                                'Anonymous Customer',
                            location: 'US',
                            review: a.content,
                            stars: a.rating,
                        }))
                    );
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            setLoading(true);
            fetchReviews();
        }
    }, [productId]);

    if (loading) {
        return (
            <Flex justifyContent="center" alignItems="center" height="450px">
                <Text color="white">Loading reviews...</Text>
            </Flex>
        );
    }

    return reviews.length > 0 ? (
        <Flex
            maxW="1280px"
            my="2rem"
            width={'100%'}
            height="450px"
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
                    cursor={reviews.length > 2 ? 'pointer' : 'default'}
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
                        {displayedReviews.map((review, index) =>
                            review ? (
                                <ReviewCard
                                    key={review.id}
                                    name={review.name}
                                    location={review.location}
                                    review={review.review}
                                    stars={review.stars}
                                />
                            ) : (
                                <Box key={index} width={'506.63px'} />
                            )
                        )}
                    </Flex>
                </Flex>

                <Flex
                    ml="auto"
                    alignSelf={'center'}
                    height="100%"
                    px="1.5rem"
                    cursor={reviews.length > 2 ? 'pointer' : 'default'}
                    onClick={handleNext}
                >
                    <Flex alignSelf={'center'}>
                        <GoArrowRight color="white" size={36} />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    ) : (
        <Flex mb={4}></Flex>
    );
    // ) : (
    //     <div>
    //         <br />
    //         <Text color="white">This product has no reviews or ratings</Text>
    //         <br />
    //         <br />
    //     </div>
    // );
};

export default ProductReview;
