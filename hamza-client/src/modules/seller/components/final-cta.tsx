import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    HStack,
    Button,
    SimpleGrid,
    Icon,
    Stack,
    Link,
} from '@chakra-ui/react';
import { TrendingUp, DollarSign, Globe, Check } from 'lucide-react';

interface FeatureBadgeProps {
    icon: React.ElementType;
    text: string;
    index: number;
    isVisible: boolean;
}

interface StatCardProps {
    value: string;
    label: string;
    icon: React.ElementType;
    index: number;
    isVisible: boolean;
}

const features = [
    { icon: Check, text: 'No setup fees' },
    { icon: Check, text: 'Start earning in minutes' },
    { icon: Check, text: '24/7 support' },
];

const stats = [
    { value: '340%', label: 'Average Revenue Growth', icon: TrendingUp },
    { value: '80%', label: 'Fee Savings', icon: DollarSign },
    { value: '190+', label: 'Countries Reached', icon: Globe },
];

const FeatureBadge = memo(({ icon, text, index, isVisible }: FeatureBadgeProps) => {
    return (
        <HStack
            spacing={3}
            px={4}
            py={2}
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
            transition={`all 0.6s ease ${1.8 + (index * 0.1)}s`}
        >
            <Icon as={icon} w={4} h={4} color="green.400" />
            <Text
                fontSize={{ base: 'sm', md: 'md' }}
                fontWeight="medium"
                color="white"
                whiteSpace="nowrap"
            >
                {text}
            </Text>
        </HStack>
    );
});

FeatureBadge.displayName = 'FeatureBadge';

const StatCard = memo(({ value, label, icon, index, isVisible }: StatCardProps) => {
    return (
        <VStack
            spacing={4}
            textAlign="center"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)'}
            transition={`all 0.6s ease ${1.0 + (index * 0.2)}s`}
        >
            <Box
                w={16}
                h={16}
                borderRadius="xl"
                bg="rgba(34, 197, 94, 0.1)"
                border="1px solid rgba(34, 197, 94, 0.3)"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Icon as={icon} w={8} h={8} color="green.400" />
            </Box>

            <VStack spacing={1}>
                <Text
                    fontSize={{ base: '2xl', md: '3xl' }}
                    fontWeight="bold"
                    fontFamily="Arial, Helvetica, sans-serif"
                    color="white"
                    lineHeight="1"
                >
                    {value}
                </Text>
                <Text
                    fontSize={{ base: 'xs', md: 'sm' }}
                    fontFamily="Arial, Helvetica, sans-serif"
                    color="gray.400"
                    fontWeight="medium"
                    textAlign="center"
                    maxW="120px"
                >
                    {label}
                </Text>
            </VStack>
        </VStack>
    );
});

StatCard.displayName = 'StatCard';

const SellerFinalCTASection = memo(() => {
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
            py={{ base: 20, md: 32 }}
            bg="black"
            position="relative"
            overflow="hidden"
        >
            <Container maxW="6xl" position="relative" zIndex={1}>
                <VStack spacing={16}>
                    <Box
                        bg="rgba(255, 255, 255, 0.02)"
                        border="1px solid rgba(255, 255, 255, 0.1)"
                        borderRadius="2xl"
                        p={{ base: 12, md: 16, lg: 20 }}
                        backdropFilter="blur(10px)"
                        textAlign="center"
                        position="relative"
                        overflow="hidden"
                        maxW="5xl"
                        mx="auto"
                        opacity={isVisible ? 1 : 0}
                        transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                        transition="all 0.8s ease 0.2s"
                    >
                        <VStack position="relative" zIndex={1} spacing={8}>
                            <VStack
                                spacing={4}
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                                transition="all 0.6s ease 0.4s"
                            >
                                {/* Mobile View */}
                                <Text
                                    display={{ base: 'block', md: 'none' }}
                                    fontSize="3xl"
                                    fontWeight="300"
                                    fontFamily="Arial, Helvetica, sans-serif"
                                    letterSpacing="-0.025em"
                                    color="white"
                                    lineHeight="1.2"
                                    textAlign="center"
                                >
                                    Your{' '}
                                    <Text as="span" bgGradient="linear(to-r, #22c55e, #a855f7)" bgClip="text">
                                        Decentralized
                                    </Text>{' '}
                                    Store Awaits
                                </Text>

                                {/* Desktop View */}
                                <Box display={{ base: 'none', md: 'block' }}>
                                    <HStack spacing={4} flexWrap="wrap" justify="center">
                                        <Text
                                            fontSize={{ md: '3xl', lg: '5xl' }}
                                            fontWeight="300"
                                            fontFamily="Arial, Helvetica, sans-serif"
                                            letterSpacing="-0.025em"
                                            color="white"
                                            lineHeight="1"
                                        >
                                            Your
                                        </Text>
                                        <Text
                                            fontSize={{ md: '3xl', lg: '5xl' }}
                                            fontWeight="300"
                                            fontFamily="Arial, Helvetica, sans-serif"
                                            letterSpacing="-0.025em"
                                            lineHeight="1"
                                            bgGradient="linear(to-r, #22c55e, #a855f7)"
                                            bgClip="text"
                                        >
                                            Decentralized
                                        </Text>
                                        <Text
                                            fontSize={{ md: '3xl', lg: '5xl' }}
                                            fontWeight="300"
                                            fontFamily="Arial, Helvetica, sans-serif"
                                            letterSpacing="-0.025em"
                                            color="white"
                                            lineHeight="1"
                                        >
                                            Store
                                        </Text>
                                    </HStack>
                                    <Text
                                        fontSize={{ md: '3xl', lg: '5xl' }}
                                        fontWeight="300"
                                        fontFamily="Arial, Helvetica, sans-serif"
                                        letterSpacing="-0.025em"
                                        color="white"
                                        lineHeight="1"
                                        mt={2}
                                    >
                                        Awaits
                                    </Text>
                                </Box>

                                <Text
                                    fontSize={{ base: 'lg', md: '2xl' }}
                                    fontWeight="300"
                                    fontFamily="Arial, Helvetica, sans-serif"
                                    color="white"
                                    maxW="3xl"
                                    lineHeight="1.6"
                                    textAlign="center"
                                    mx="auto"
                                    opacity={isVisible ? 1 : 0}
                                    transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                                    transition="all 0.6s ease 0.6s"
                                >
                                    Join the revolution. Start selling without limits, earn more with lower
                                    fees, and reach customers worldwide on the blockchain.
                                </Text>
                            </VStack>

                            {/* Stats Grid */}
                            <SimpleGrid
                                columns={{ base: 1, md: 3 }}
                                spacing={{ base: 8, md: 12 }}
                                w="100%"
                                maxW="4xl"
                                mx="auto"
                            >
                                {stats.map((stat, index) => (
                                    <StatCard
                                        key={stat.label}
                                        value={stat.value}
                                        label={stat.label}
                                        icon={stat.icon}
                                        index={index}
                                        isVisible={isVisible}
                                    />
                                ))}
                            </SimpleGrid>

                            {/* CTA Buttons */}
                            <HStack
                                spacing={4}
                                flexDirection={{ base: 'column', md: 'row' }}
                                w="100%"
                                justify="center"
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                                transition="all 0.6s ease 1.4s"
                            >
                                <Link href="https://admin.hamza.market/" isExternal w={{ base: "100%", md: "auto" }}>
                                    <Button
                                        as="span"
                                        size="lg"
                                        bg="linear-gradient(to right, #4ade80, #22c55e)"
                                        color="black"
                                        fontWeight="500"
                                        fontFamily="Arial, Helvetica, sans-serif"
                                        px={10}
                                        py={6}
                                        fontSize="lg"
                                        borderRadius="full"
                                        w={{ base: "100%", md: "auto" }}
                                        _hover={{
                                            bg: "linear-gradient(to right, #22c55e, #16a34a)",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)",
                                        }}
                                        _active={{
                                            transform: "translateY(0)",
                                        }}
                                        transition="all 0.3s ease"
                                        rightIcon={
                                            <Box
                                                as="span"
                                                fontSize="xl"
                                                transition="transform 0.3s ease"
                                                _groupHover={{ transform: "translateX(4px)" }}
                                            >
                                                →
                                            </Box>
                                        }
                                        cursor="pointer"
                                    >
                                        Start Selling Now
                                    </Button>
                                </Link>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    borderColor="purple.400"
                                    color="purple.400"
                                    fontWeight="500"
                                    fontFamily="Arial, Helvetica, sans-serif"
                                    px={10}
                                    py={6}
                                    fontSize="lg"
                                    borderRadius="full"
                                    bg="transparent"
                                    w={{ base: "100%", md: "auto" }}
                                    _hover={{
                                        borderColor: "purple.400",
                                        bg: "rgba(168, 85, 247, 0.1)",
                                        transform: "translateY(-2px)",
                                    }}
                                    _active={{
                                        transform: "translateY(0)",
                                    }}
                                    transition="all 0.3s ease"
                                >
                                    Schedule Demo
                                </Button>
                            </HStack>

                            {/* Feature badges */}
                            <HStack
                                spacing={{ base: 2, md: 8 }}
                                flexWrap="wrap"
                                justify="center"
                                mt={4}
                            >
                                {features.map((feature, index) => (
                                    <FeatureBadge
                                        key={feature.text}
                                        icon={feature.icon}
                                        text={feature.text}
                                        index={index}
                                        isVisible={isVisible}
                                    />
                                ))}
                            </HStack>

                            {/* Bottom text */}
                            <Text
                                fontSize={{ base: 'md', md: 'lg' }}
                                fontWeight="300"
                                fontFamily="Arial, Helvetica, sans-serif"
                                color="gray.400"
                                maxW="3xl"
                                lineHeight="1.6"
                                textAlign="center"
                                mx="auto"
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                                transition="all 0.6s ease 2.2s"
                            >
                                Join over 50,000 sellers who have already discovered the power of decentralized commerce. Your success story starts here.
                            </Text>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
});

SellerFinalCTASection.displayName = 'SellerFinalCTASection';

export default SellerFinalCTASection;