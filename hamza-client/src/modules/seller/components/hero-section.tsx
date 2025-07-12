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
    Grid,
    GridItem,
    Flex,
    Link,
} from '@chakra-ui/react';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { TrendingUp, DollarSign, Globe, Shield, ArrowDown } from 'lucide-react';

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

const stats = [
    { icon: TrendingUp, value: '97%', label: 'Seller Success Rate' },
    { icon: DollarSign, value: '2-3%', label: 'Platform Fees' },
    { icon: Globe, value: '190+', label: 'Countries Reached' },
    { icon: Shield, value: '100%', label: 'Secure Transactions' },
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
            px={{ base: 3, sm: 4 }}
            pt={{ base: 12, sm: 16, lg: 20 }}
        >
            {/* Background Pattern */}
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                opacity="0.1"
            >
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    bgGradient="linear(to-br, rgba(34, 197, 94, 0.2), transparent, rgba(168, 85, 247, 0.2))"
                />
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0, 255, 0, 0.1) 0%, transparent 50%), 
                                       radial-gradient(circle at 75% 75%, rgba(128, 0, 128, 0.1) 0%, transparent 50%)`,
                    }}
                />
            </Box>

            <Container maxW="1200px" textAlign="center" zIndex={1} w="full">
                <VStack spacing={{ base: 8, sm: 12, lg: 16 }}>
                    {/* Typography Hierarchy */}
                    <VStack spacing={{ base: 4, sm: 6, lg: 8 }}>
                        {/* Overline */}
                        <Text
                            fontSize={{ base: 'xs', sm: 'sm' }}
                            fontWeight="300"
                            letterSpacing="0.2em"
                            textTransform="uppercase"
                            color="gray.400"
                            mb={{ base: 4, sm: 6, lg: 8 }}
                        >
                            Join the Revolution
                        </Text>

                        {/* Primary Display Type */}
                        <VStack spacing={{ base: 1, sm: 2, lg: 4, xl: 6 }}>
                            <Text
                                fontSize={{ base: '3xl', sm: '5xl', md: '6xl', lg: '8xl', xl: '9xl' }}
                                fontWeight="200"
                                lineHeight="0.9"
                                letterSpacing="-0.025em"
                                bgGradient="linear(to-r, #22c55e, #a855f7)"
                                bgClip="text"
                            >
                                Sell
                            </Text>

                            <Flex
                                direction={{ base: 'column', md: 'row' }}
                                align="center"
                                justify="center"
                                gap={{ base: 2, sm: 4, lg: 6, xl: 8 }}
                                flexWrap="wrap"
                                fontSize={{ base: '2xl', sm: '4xl', md: '5xl', lg: '7xl', xl: '8xl' }}
                                fontWeight="300"
                                lineHeight="0.9"
                                letterSpacing="-0.025em"
                                color="white"
                            >
                                <Text>on Hamza</Text>
                                {/* Crypto Icons - Clean without circles */}
                                <HStack spacing={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
                                    {cryptoIcons.map((icon, index) => (
                                        <Box
                                            key={icon.code}
                                            _hover={{ transform: 'scale(1.1)' }}
                                            transition="transform 0.3s"
                                            style={{
                                                animationDelay: `${index * 0.2}s`,
                                            }}
                                        >
                                            <Image
                                                src={icon.src}
                                                alt={icon.alt}
                                                w={{ base: '20px', sm: '32px', md: '40px', lg: '48px', xl: '64px' }}
                                                h={{ base: '20px', sm: '32px', md: '40px', lg: '48px', xl: '64px' }}
                                            />
                                        </Box>
                                    ))}
                                </HStack>
                            </Flex>

                            <Text
                                fontSize={{ base: 'xl', sm: '3xl', md: '4xl', lg: '6xl', xl: '7xl' }}
                                fontWeight="300"
                                color="white"
                                letterSpacing="-0.025em"
                            >
                                Without Limits
                            </Text>
                        </VStack>

                        {/* Subtitle */}
                        <Box pt={{ base: 4, sm: 6, lg: 8, xl: 12 }}>
                            <Text
                                fontSize={{ base: 'sm', sm: 'lg', md: 'xl', lg: '2xl', xl: '3xl' }}
                                fontWeight="300"
                                lineHeight="1.6"
                                color="gray.300"
                                maxW="4xl"
                                mx="auto"
                                letterSpacing="wide"
                                px={{ base: 2, sm: 4 }}
                            >
                                Join thousands of sellers earning more with lower fees, instant payments, and global reach on the
                                world's first decentralized marketplace.
                            </Text>
                        </Box>
                    </VStack>

                    {/* CTA Buttons */}
                    <Flex
                        direction={{ base: 'column', sm: 'row' }}
                        gap={{ base: 3, sm: 4, lg: 6 }}
                        justify="center"
                        align="center"
                        pt={{ base: 6, sm: 8 }}
                    >
                        <Link href="https://admin.hamza.market/" isExternal>
                            <Button
                                as="span"
                                size="lg"
                                w={{ base: 'full', sm: 'auto' }}
                                bgGradient="linear(to-r, #22c55e, #10b981)"
                                color="black"
                                px={{ base: 6, sm: 8, lg: 10 }}
                                py={{ base: 3, sm: 4, lg: 5 }}
                                fontSize={{ base: 'base', sm: 'lg', lg: 'xl' }}
                                fontWeight="medium"
                                borderRadius="full"
                                _hover={{
                                    bgGradient: "linear(to-r, #10b981, #059669)",
                                    transform: 'translateY(-2px)',
                                }}
                                transition="all 0.3s"
                                cursor="pointer"
                            >
                                Start Selling Now
                            </Button>
                        </Link>

                        <Button
                            size="lg"
                            variant="outline"
                            w={{ base: 'full', sm: 'auto' }}
                            borderColor="purple.400"
                            color="purple.400"
                            px={{ base: 6, sm: 8, lg: 10 }}
                            py={{ base: 3, sm: 4, lg: 5 }}
                            fontSize={{ base: 'base', sm: 'lg', lg: 'xl' }}
                            fontWeight="medium"
                            borderRadius="full"
                            bg="transparent"
                            _hover={{
                                bg: "purple.400",
                                color: "black",
                            }}
                            onClick={handleLearnMoreClick}
                        >
                            Learn More
                        </Button>
                    </Flex>

                    {/* Seller Stats */}
                    <Grid
                        templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
                        gap={{ base: 4, sm: 6, lg: 8 }}
                        pt={{ base: 8, sm: 12, lg: 20 }}
                        maxW="4xl"
                        mx="auto"
                        w="full"
                    >
                        {stats.map((stat, index) => (
                            <GridItem key={index}>
                                <VStack
                                    spacing={{ base: 2, sm: 3 }}
                                    textAlign="center"
                                    cursor="pointer"
                                    _hover={{ transform: 'scale(1.1)' }}
                                    transition="transform 0.3s"
                                >
                                    <Box
                                        w={{ base: '48px', sm: '64px' }}
                                        h={{ base: '48px', sm: '64px' }}
                                        mx="auto"
                                        bgGradient="linear(to-br, rgba(34, 197, 94, 0.2), rgba(168, 85, 247, 0.2))"
                                        borderRadius={{ base: 'xl', sm: '2xl' }}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Icon as={stat.icon} w={{ base: 6, sm: 8 }} h={{ base: 6, sm: 8 }} color="green.400" />
                                    </Box>
                                    <Text
                                        fontSize={{ base: 'lg', sm: '2xl', lg: '3xl' }}
                                        fontWeight="bold"
                                        color="white"
                                    >
                                        {stat.value}
                                    </Text>
                                    <Text
                                        fontSize={{ base: 'xs', sm: 'sm' }}
                                        color="gray.400"
                                        fontWeight="300"
                                        px={1}
                                    >
                                        {stat.label}
                                    </Text>
                                </VStack>
                            </GridItem>
                        ))}
                    </Grid>

                    {/* Scroll indicator */}
                    <VStack
                        pt={{ base: 8, sm: 12, lg: 20 }}
                        spacing={{ base: 3, sm: 4, lg: 6 }}
                        color="gray.400"
                        _hover={{ color: 'green.400' }}
                        transition="colors 0.5s"
                        cursor="pointer"
                        onClick={handleLearnMoreClick}
                    >
                        <VStack spacing={2}>
                            <Text
                                fontSize={{ base: 'xs', sm: 'sm' }}
                                fontWeight="medium"
                                letterSpacing="0.15em"
                                textTransform="uppercase"
                            >
                                Discover Benefits
                            </Text>
                            <Box
                                w={{ base: '40px', sm: '48px', lg: '64px' }}
                                h="1px"
                                bg="gray.600"
                                _groupHover={{ bg: 'green.400' }}
                                transition="background 0.5s"
                                mx="auto"
                            />
                        </VStack>
                        <Box
                            sx={{
                                animation: 'bounce 2s infinite',
                                '@keyframes bounce': {
                                    '0%, 20%, 50%, 80%, 100%': {
                                        transform: 'translateY(0)',
                                    },
                                    '40%': {
                                        transform: 'translateY(-10px)',
                                    },
                                    '60%': {
                                        transform: 'translateY(-5px)',
                                    },
                                },
                            }}
                        >
                            <Icon as={ArrowDown} w={{ base: 4, sm: 5, lg: 6 }} h={{ base: 4, sm: 5, lg: 6 }} />
                        </Box>
                    </VStack>
                </VStack>
            </Container>
        </Box>
    );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;