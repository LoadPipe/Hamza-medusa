import React, { useEffect, useState, useCallback, memo } from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    HStack,
    Button,
    Image,
    Icon,
    Stack,
} from '@chakra-ui/react';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { Zap, Shield, Gift, ArrowDown } from 'lucide-react';

const cryptoIcons = [
    {
        src: currencyIcons['btc'].src,
        alt: 'Bitcoin',
        code: 'BTC',
    },
    {
        src: currencyIcons.eth.src,
        alt: 'Ethereum',
        code: 'ETH',
    },
    {
        src: currencyIcons.usdt.src,
        alt: 'Tether',
        code: 'USDT',
    },
    {
        src: currencyIcons.usdc.src,
        alt: 'USD Coin',
        code: 'USDC',
    },
];

const features = [
    { icon: Zap, text: 'Instant Delivery' },
    { icon: Shield, text: 'Secure Payments' },
    { icon: Gift, text: 'Top Brands' },
];

const HeroSection = memo(() => {
    const [showAnimations, setShowAnimations] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowAnimations(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleLearnMoreClick = useCallback(() => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    }, []);

    return (
        <Box
            position="relative"
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="black"
            color="white"
            overflow="hidden"
        >
            <Box
                position="absolute"
                top="30%"
                left="20%"
                width="200px"
                height="200px"
                borderRadius="50%"
                bg="linear-gradient(45deg, rgba(34, 197, 94, 0.05), rgba(168, 85, 247, 0.05))"
                filter="blur(80px)"
                opacity={0.6}
            />
            <Box
                position="absolute"
                bottom="30%"
                right="20%"
                width="250px"
                height="250px"
                borderRadius="50%"
                bg="linear-gradient(225deg, rgba(168, 85, 247, 0.05), rgba(34, 197, 94, 0.05))"
                filter="blur(100px)"
                opacity={0.6}
            />

            <Container maxW="6xl" textAlign="center" zIndex={1}>
                <VStack spacing={4}>
                    {/* Top Label */}
                    <Text
                        fontSize={{ base: 'xs', md: 'sm' }}
                        fontWeight="medium"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        color="gray.400"
                        mb={4}
                    >
                        Buy Gift Cards with Cryptocurrency on Hamza
                    </Text>

                    {/* Main Heading */}
                    <Text
                        fontSize={{ base: '3xl', md: '5xl', lg: '9xl' }}
                        fontFamily="Arial, Helvetica, sans-serif"
                        fontWeight="200"
                        letterSpacing="-0.025em"
                        lineHeight="1"
                        bgGradient="linear(to-r, #22c55e, #a855f7)"
                        bgClip="text"
                    >
                        Gift Cards
                    </Text>

                    <Text
                        fontSize={{ base: '2xl', md: '4xl', lg: '8xl' }}
                        fontFamily="Arial, Helvetica, sans-serif"
                        fontWeight="200"
                        letterSpacing="-0.025em"
                        lineHeight="1"
                        color="white"
                        opacity={showAnimations ? 1 : 0}
                        transform={showAnimations ? 'translateY(0)' : 'translateY(50px)'}
                        transition="all 0.6s ease 0.2s"
                    >
                        Meet Crypto
                    </Text>

                    <Stack
                        direction={{ base: 'column', md: 'row' }}
                        spacing={4}
                        alignItems="center"
                        justify="center"
                        mb={6}
                    >
                        <Text
                            fontSize={{ base: '2xl', md: '4xl', lg: '7xl' }}
                            fontFamily="Arial, Helvetica, sans-serif"
                            fontWeight="200"
                            letterSpacing="-0.025em"
                            color="white"
                            opacity={showAnimations ? 1 : 0}
                            transform={showAnimations ? 'translateY(0)' : 'translateY(30px)'}
                            transition="all 0.5s ease 0.8s"
                        >
                            on Hamza
                        </Text>

                        {/* Crypto Icons */}
                        <HStack spacing={3} ml={{ base: 0, md: 4 }}>
                            {cryptoIcons.map((crypto, index) => (
                                <Box
                                    key={crypto.code}
                                    w={{ base: '40px', md: '50px', lg: '60px' }}
                                    h={{ base: '40px', md: '50px', lg: '60px' }}
                                    borderRadius="full"
                                    bg="black"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    backdropFilter="blur(10px)"
                                    opacity={showAnimations ? 1 : 0}
                                    transform={showAnimations ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(20px)'}
                                    transition={`all 0.4s ease ${1.3 + (index * 0.15)}s`}
                                >
                                    <Image
                                        src={crypto.src}
                                        alt={crypto.alt}
                                        w="80%"
                                        h="80%"
                                        objectFit="contain"
                                    />
                                </Box>
                            ))}
                        </HStack>
                    </Stack>

                    {/* Description */}
                    <Text
                        fontSize={{ base: '14px', md: 'xl', lg: '3xl' }}
                        fontFamily="Arial, Helvetica, sans-serif"
                        fontWeight="300"
                        letterSpacing="0.025em"
                        color="gray.300"
                        maxW="4xl"
                        lineHeight="1.2"
                        px={4}
                        textAlign="center"
                        opacity={showAnimations ? 1 : 0}
                        transform={showAnimations ? 'translateY(0)' : 'translateY(30px)'}
                        transition="all 0.5s ease 1.9s"
                    >
                        Shop gift cards from top brands using Bitcoin, Ethereum, and
                        other cryptocurrencies. Secure payments, instant delivery,
                        worldwide access.
                    </Text>

                    {/* Feature Badges */}
                    <Stack
                        direction={{ base: 'column', md: 'row' }}
                        spacing={{ base: 0, md: 6 }}
                        mt={8}
                        align="center"
                        justify="center"
                        opacity={showAnimations ? 1 : 0}
                        transform={showAnimations ? 'translateY(0)' : 'translateY(30px)'}
                        transition="all 0.5s ease 2.4s"
                    >
                        {features.map((feature, index) => (
                            <HStack
                                key={feature.text}
                                spacing={2}
                                bg='black'
                                borderRadius="full"
                                px={4}
                                py={2}
                                backdropFilter="blur(10px)"
                            >
                                <Icon as={feature.icon} w={5} h={5} color="green.400" />
                                <Text
                                    fontSize={{ base: 'sm', md: 'md' }}
                                    fontWeight="light"
                                    letterSpacing="wider"
                                    color="gray.300"
                                >
                                    {feature.text}
                                </Text>
                            </HStack>
                        ))}
                    </Stack>

                    {/* Learn More Button */}
                    <Button
                        variant="ghost"
                        size="lg"
                        color="white"
                        mt={24}
                        opacity={showAnimations ? 1 : 0}
                        transform={showAnimations ? 'translateY(0)' : 'translateY(30px)'}
                        transition="all 0.5s ease 2.9s"
                        _hover={{
                            transform: 'translateY(-8px)',
                            color: '#4ADE80',
                            transition: 'all 0.3s ease'
                        }}
                        _focus={{
                            boxShadow: 'none',
                            bg: 'transparent'
                        }}
                        _active={{
                            bg: 'transparent'
                        }}
                        _focusVisible={{
                            boxShadow: 'none',
                            bg: 'transparent'
                        }}
                        onClick={handleLearnMoreClick}
                    >
                        <VStack spacing={2}>
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                letterSpacing="0.1em"
                                textTransform="uppercase"
                                position="relative"
                                _after={{
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-8px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '60%',
                                    height: '1px',
                                    bg: 'gray.600',
                                    transition: 'background-color 0.3s ease',
                                }}
                                _hover={{
                                    _after: {
                                        bg: 'green.400'
                                    }
                                }}
                            >
                                Learn More
                            </Text>
                            <Box
                                mt={8}
                                sx={{
                                    animation: 'bounce 3s infinite',
                                    '@keyframes bounce': {
                                        '0%, 100%': {
                                            transform: 'translateY(0px)',
                                        },
                                        '50%': {
                                            transform: 'translateY(12px)',
                                        },
                                    },
                                }}
                            >
                                <ArrowDown size={24} />
                            </Box>
                        </VStack>
                    </Button>
                </VStack>
            </Container>
        </Box>
    );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;