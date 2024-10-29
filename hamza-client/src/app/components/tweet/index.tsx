'use client';
import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, Text } from '@chakra-ui/react';
import { FaXTwitter } from 'react-icons/fa6';

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
        const product_url = `${process.env.NEXT_PUBLIC_MEDUSA_CLIENT_URL}/${process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'}/products/${productHandle}`;
        const tweetHref = isPurchased
            ? `https://twitter.com/intent/tweet?text=I bought this cool thing at Hamza.market! ${encodeURIComponent(product_url)} Buy and sell products with Crypto at Hamza - the world’s first decom marketplace.`
            : `https://twitter.com/intent/tweet?text=Check out this cool product at Hamza.market! ${encodeURIComponent(product_url)} Buy and sell products with Crypto at Hamza - the world’s first decom marketplace.`;
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
                            <FaXTwitter color="white" size={16} />
                        </Box>
                    </Flex>
                </Button>
            </a>
        </Box>
    );
};

export default Tweet;
