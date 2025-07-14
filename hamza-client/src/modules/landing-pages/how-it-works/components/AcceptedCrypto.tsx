import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    SimpleGrid,
    Image,
} from '@chakra-ui/react';
import currencyIcons from '@/images/currencies/crypto-currencies';

interface AcceptedCryptoProps {
    selectedLanguage: string;
}

interface CryptoCardProps {
    crypto: {
        name: string;
        symbol: string;
        icon: string;
    };
    index: number;
    isVisible: boolean;
}

const cryptos = [
    { name: 'Bitcoin', symbol: 'BTC', icon: currencyIcons['btc'].src },
    { name: 'Ethereum', symbol: 'ETH', icon: currencyIcons.eth.src },
    { name: 'USDT', symbol: 'USDT', icon: currencyIcons.usdt.src },
    { name: 'USDC', symbol: 'USDC', icon: currencyIcons.usdc.src },
];

const CryptoCard = memo(({ crypto, index, isVisible }: CryptoCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    return (
        <Box
            bg="rgba(0, 0, 0, 0.5)"
            backdropFilter="blur(4px)"
            borderRadius={{ base: '2xl', sm: '3xl' }}
            p={{ base: 6, sm: 8, lg: 12 }}
            textAlign="center"
            cursor="pointer"
            border="1px solid"
            borderColor="rgba(31, 41, 55, 0.5)"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)'}
            transition={`all 0.6s ease-out ${0.3 + (index * 0.1)}s`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            _hover={{
                transform: 'translateY(-12px) scale(1.05)',
                borderColor: 'rgba(34, 197, 94, 0.5)',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
            }}
            _active={{
                transform: 'translateY(-8px) scale(0.98)',
            }}
            sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            {/* Icon */}
            <Box mb={{ base: 6, sm: 8 }} mx="auto" w="fit-content">
                <Image
                    src={crypto.icon || "/placeholder.svg"}
                    alt={`${crypto.name} logo`}
                    w={{ base: 16, sm: 20, lg: 24 }}
                    h={{ base: 16, sm: 20, lg: 24 }}
                />
            </Box>

            {/* Typography */}
            <VStack spacing={{ base: 2, sm: 3 }}>
                <Text
                    fontSize={{ base: 'lg', sm: 'xl', lg: '2xl' }}
                    fontWeight="500"
                    color={isHovered ? "green.400" : "white"}
                    transition="color 0.3s ease"
                    lineHeight="tight"
                    letterSpacing="wide"
                    opacity={isVisible ? 1 : 0}
                    transitionDelay={`${0.5 + (index * 0.1)}s`}
                >
                    {crypto.name}
                </Text>

                {/* Visual separator */}
                <Box
                    w={{ base: 6, sm: 8 }}
                    h="1px"
                    bg={isHovered ? "green.400" : "gray.700"}
                    transition="background-color 0.3s ease"
                    mx="auto"
                />

                <Text
                    color="gray.400"
                    fontSize={{ base: 'sm', sm: 'base', lg: 'lg' }}
                    fontWeight="300"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    opacity={isVisible ? 1 : 0}
                    transitionDelay={`${0.6 + (index * 0.1)}s`}
                >
                    {crypto.symbol}
                </Text>
            </VStack>
        </Box>
    );
});

CryptoCard.displayName = 'CryptoCard';

const AcceptedCrypto = memo(({ selectedLanguage }: AcceptedCryptoProps) => {
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
            as="section"
            id="crypto"
            mt={{ base: 12, sm: 16 }}
            maxW="1200px"
            mx="auto"
            px={4}
            position="relative"
        >
            {/* Typography Hierarchy - Section Header with Green Theme */}
            <VStack
                spacing={6}
                textAlign="center"
                mb={{ base: 16, sm: 20, lg: 24 }}
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                transition="all 0.8s ease-out"
            >
                {/* Overline */}
                <Text
                    color="gray.500"
                    fontSize={{ base: 'xs', sm: 'sm' }}
                    fontWeight="300"
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    mb={{ base: 4, sm: 6 }}
                >
                    Payment Methods
                </Text>

                {/* Primary heading - Mobile-optimized */}
                <Text
                    fontSize={{ base: '2xl', sm: '3xl', lg: '5xl', xl: '6xl' }}
                    fontWeight="300"
                    color="white"
                    mb={{ base: 6, sm: 8 }}
                    letterSpacing="tight"
                    lineHeight="1.1"
                    px={2}
                >
                    We Accept a Wide Range of{' '}
                    <Text as="span" color="green.400" fontWeight="500">
                        Cryptocurrencies
                    </Text>
                </Text>

                {/* Visual separator */}
                <Box
                    w={{ base: 16, sm: 24 }}
                    h="1px"
                    bgGradient="linear(to-r, transparent, green.400, transparent)"
                    mx="auto"
                />
            </VStack>

            {/* Crypto Grid - Mobile-optimized */}
            <SimpleGrid
                columns={{ base: 2, sm: 2, md: 4 }}
                spacing={{ base: 4, sm: 6, lg: 12 }}
                mb={{ base: 12, sm: 16 }}
            >
                {cryptos.map((crypto, index) => (
                    <CryptoCard
                        key={crypto.symbol}
                        crypto={crypto}
                        index={index}
                        isVisible={isVisible}
                    />
                ))}
            </SimpleGrid>

            {/* Footer text */}
            <Box
                textAlign="center"
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                transition="all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s"
            >
                <Text
                    color="gray.400"
                    fontSize={{ base: 'base', sm: 'lg', lg: 'xl' }}
                    fontWeight="300"
                    lineHeight="relaxed"
                    letterSpacing="wide"
                    maxW="2xl"
                    mx="auto"
                    px={2}
                >
                    More cryptocurrencies are being added continuously. Stay
                    tuned for updates!
                </Text>
            </Box>
        </Box>
    );
});

AcceptedCrypto.displayName = 'AcceptedCrypto';

export default AcceptedCrypto;