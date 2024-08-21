'use client';
import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, Text } from '@chakra-ui/react';

type TweetProps = {
    productHandle: string;
    isPurchased?: boolean;
};

const Tweet: React.FC<TweetProps> = ({
    productHandle,
    isPurchased = false,
}) => {
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        const product_url = `https://demo.hamza.biz/us/products/${productHandle}`;
        const tweetHref = isPurchased
            ? `https://twitter.com/intent/tweet?text=I bought this cool thing at Hamza.biz! ${encodeURIComponent(product_url)} Buy and sell products with Crypto at Hamza - the world’s first decom marketplace.`
            : `https://twitter.com/intent/tweet?text=Check out this cool product at Hamza.biz! ${encodeURIComponent(product_url)} Buy and sell products with Crypto at Hamza - the world’s first decom marketplace.`;
        document
            .getElementById('tweet-button')
            ?.setAttribute('href', tweetHref);
        setIsDisabled(false);
    }, [productHandle, isPurchased]);

    return (
        <Box>
            <a href="#" id="tweet-button" target="_blank">
                <Button
                    as="div"
                    className="mb-2"
                    isDisabled={isDisabled}
                    bg="black"
                    color="white"
                    px={4}
                    py={4}
                    fontSize="xs"
                    fontWeight="medium"
                    textTransform="uppercase"
                    shadow="md"
                    transition="all 0.15s ease-in-out"
                    _hover={{ shadow: 'lg' }}
                    _focus={{ outline: 'none', shadow: 'lg' }}
                    _active={{ shadow: 'lg' }}
                >
                    <Flex align="center">
                        <Box as="span">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 512 512"
                                height="16"
                                width="16"
                            >
                                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                            </svg>
                        </Box>
                        {/* <Text>Tweet this product</Text> */}
                    </Flex>
                </Button>
            </a>
        </Box>
    );
};

export default Tweet;
