import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    SimpleGrid,
    HStack,
    Image,
} from '@chakra-ui/react';
import currencyIcons from '@/images/currencies/crypto-currencies';

interface CryptoCardProps {
    name: string;
    symbol: string;
    description: string;
    iconSrc: string;
    iconFallback: string;
    bgGradient: string;
    borderColor: string;
    index: number;
    isVisible: boolean;
}

const cryptoMethods = [
    {
        name: 'Bitcoin',
        symbol: 'BTC',
        description: 'Most widely accepted cryptocurrency',
        iconSrc: currencyIcons.btc.src,
        iconFallback: '₿',
        bgGradient: 'linear-gradient(135deg, rgba(247, 147, 26, 0.2), rgba(255, 165, 0, 0.2))',
        borderColor: 'rgba(247, 147, 26, 0.5)',
    },
    {
        name: 'Ethereum',
        symbol: 'ETH',
        description: 'Smart contract platform token',
        iconSrc: currencyIcons.eth.src,
        iconFallback: 'Ξ',
        bgGradient: 'linear-gradient(135deg, rgba(99, 125, 255, 0.2), rgba(124, 124, 255, 0.2))',
        borderColor: 'rgba(99, 125, 255, 0.5)',
    },
    {
        name: 'Tether',
        symbol: 'USDT',
        description: 'Most popular stablecoin',
        iconSrc: currencyIcons.usdt.src,
        iconFallback: '₮',
        bgGradient: 'linear-gradient(135deg, rgba(38, 166, 154, 0.2), rgba(0, 181, 173, 0.2))',
        borderColor: 'rgba(38, 166, 154, 0.5)',
    },
    {
        name: 'USD Coin',
        symbol: 'USDC',
        description: 'Regulated stablecoin',
        iconSrc: currencyIcons.usdc.src,
        iconFallback: '$',
        bgGradient: 'linear-gradient(135deg, rgba(45, 117, 240, 0.2), rgba(33, 150, 243, 0.2))',
        borderColor: 'rgba(45, 117, 240, 0.5)',
    },
];

const CryptoCard = memo(({ name, symbol, description, iconSrc, iconFallback, index, isVisible }: CryptoCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [hasInitialAnimationCompleted, setHasInitialAnimationCompleted] = useState(false);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setHasInitialAnimationCompleted(true);
            }, 1200 + (index * 200));
            return () => clearTimeout(timer);
        }
    }, [isVisible, index]);

    return (
        <Box
            bg="rgba(255, 255, 255, 0.02)"
            border="2px solid"
            borderColor={isHovered ? '#39AF64' : '#103622'}
            borderRadius="2xl"
            p={8}
            backdropFilter="blur(10px)"
            position="relative"
            overflow="hidden"
            cursor="pointer"
            opacity={isVisible ? 1 : 0}
            transform={
                isVisible
                    ? isHovered
                        ? 'translateY(-6px) scale(1)'
                        : 'translateY(0) scale(1)'
                    : 'translateY(50px) scale(0.9)'
            }
            transition={
                hasInitialAnimationCompleted
                    ? 'all 0.3s ease'
                    : `all 0.6s ease ${1.2 + (index * 0.2)}s`
            }
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="group"
        >
            <VStack spacing={6} align="center" position="relative" zIndex={1}>
                <Box
                    w={32}
                    h={32}
                    borderRadius="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    transition="all 0.4s ease"
                >
                    <Image
                        src={iconSrc}
                        alt={`${name} icon`}
                        w="70%"
                        h="70%"
                        fallback={
                            <Text fontSize="2xl" fontWeight="bold" color="white">
                                {iconFallback}
                            </Text>
                        }
                    />
                </Box>

                <VStack spacing={3} textAlign="center">
                    <Text
                        fontSize={{ base: 'xl', md: '2xl' }}
                        fontWeight="500"
                        fontFamily="Arial, Helvetica, sans-serif"
                        letterSpacing="0.025em"
                        color={isHovered ? '#39AF64' : 'white'}
                        lineHeight="2rem"
                        transition="color 0.3s ease"
                    >
                        {name}
                    </Text>

                    <Box
                        w="4rem"
                        h="1px"
                        bg={isHovered ? '#39AF64' : '#1D2531'}
                        transition="background-color 0.3s ease"
                        mx="auto"
                    />

                    <Text
                        fontSize="md"
                        fontWeight="300"
                        fontFamily="Arial, Helvetica, sans-serif"
                        color="gray.400"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        lineHeight="1.5rem"
                    >
                        {symbol}
                    </Text>

                    <Text
                        fontSize="sm"
                        fontWeight="300"
                        fontFamily="Arial, Helvetica, sans-serif"
                        color="gray.500"
                        lineHeight="1.25rem"
                        textAlign="center"
                        maxW="200px"
                    >
                        {description}
                    </Text>
                </VStack>
            </VStack>
        </Box>
    );
});

CryptoCard.displayName = 'CryptoCard';

const PaymentMethodsSection = memo(() => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
            setIsVisible(true);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [handleIntersection]);

    return (
        <Box
            ref={sectionRef}
            py={{ base: 16, md: 24 }}
            bg="black"
            position="relative"
        >
            <Box
                position="absolute"
                top="20%"
                left="10%"
                width="300px"
                height="300px"
                borderRadius="50%"
                bg="linear-gradient(45deg, rgba(247, 147, 26, 0.1), rgba(99, 125, 255, 0.1))"
                filter="blur(100px)"
                opacity={0.6}
            />
            <Box
                position="absolute"
                bottom="20%"
                right="10%"
                width="400px"
                height="400px"
                borderRadius="50%"
                bg="linear-gradient(225deg, rgba(38, 166, 154, 0.1), rgba(45, 117, 240, 0.1))"
                filter="blur(120px)"
                opacity={0.6}
            />

            <Container maxW="6xl" position="relative" zIndex={1}>
                <VStack spacing={16}>
                    <VStack spacing={6} textAlign="center">
                        <Text
                            fontSize={{ base: 'xs', md: 'sm' }}
                            fontWeight="300"
                            fontFamily="Arial, Helvetica, sans-serif"
                            letterSpacing="0.2em"
                            textTransform="uppercase"
                            color="gray.500"
                            lineHeight="1.25rem"
                            opacity={isVisible ? 1 : 0}
                            transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                            transition="all 0.6s ease 0.2s"
                        >
                            Payment Methods
                        </Text>

                        <VStack spacing={4}>
                            <HStack
                                spacing={2}
                                flexWrap="wrap"
                                justify="center"
                                marginBottom="2rem"
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                                transition="all 0.6s ease 0.4s"
                            >
                                <Text
                                    fontSize={{ base: '2xl', md: '3xl', lg: '6xl' }}
                                    fontWeight="300"
                                    fontFamily="Arial, Helvetica, sans-serif"
                                    letterSpacing="-0.025em"
                                    lineHeight="1"
                                    px={2}
                                    color="white"
                                >
                                    Pay with Your Favorite
                                </Text>
                                <Text
                                    fontSize={{ base: '2xl', md: '3xl', lg: '6xl' }}
                                    fontWeight="300"
                                    fontFamily="Arial, Helvetica, sans-serif"
                                    letterSpacing="-0.025em"
                                    lineHeight="1"
                                    px={2}
                                    color="#4ADE80"
                                >
                                    Cryptocurrency
                                </Text>
                            </HStack>

                            <Text
                                fontSize={{ base: 'md', md: 'lg' }}
                                fontFamily="Arial, Helvetica, sans-serif"
                                color="white"
                                maxW="3xl"
                                lineHeight="1.6"
                                mx="auto"
                                px={2}
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                                transition="all 0.6s ease 0.6s"
                            >
                                Hamza accepts all major cryptocurrencies for gift card purchases. Choose from
                                Bitcoin, Ethereum, stablecoins, and many more digital assets.
                            </Text>
                        </VStack>

                        <Box
                            w={{ base: "5rem", sm: "8rem" }}
                            h="2px"
                            bgGradient="linear(to-r, transparent, green.400, transparent)"
                            mx="auto"
                            mb={12}
                            opacity={isVisible ? 1 : 0}
                            transform={isVisible ? 'scaleX(1)' : 'scaleX(0)'}
                            transition="all 0.6s ease 0.8s"
                        />
                    </VStack>

                    <SimpleGrid
                        columns={{ base: 1, sm: 2, lg: 4 }}
                        spacing={{ base: 6, md: 8 }}
                        w="100%"
                    >
                        {cryptoMethods.map((crypto, index) => (
                            <CryptoCard
                                key={crypto.symbol}
                                name={crypto.name}
                                symbol={crypto.symbol}
                                description={crypto.description}
                                iconSrc={crypto.iconSrc}
                                iconFallback={crypto.iconFallback}
                                bgGradient={crypto.bgGradient}
                                borderColor={crypto.borderColor}
                                index={index}
                                isVisible={isVisible}
                            />
                        ))}
                    </SimpleGrid>
                </VStack>
            </Container>
        </Box>
    );
});

PaymentMethodsSection.displayName = 'PaymentMethodsSection';

export default PaymentMethodsSection;