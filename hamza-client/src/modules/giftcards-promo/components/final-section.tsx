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
} from '@chakra-ui/react';
import Link from 'next/link';
import { Zap, Shield, Globe } from 'lucide-react';

interface FeatureBadgeProps {
    icon: React.ElementType;
    text: string;
    index: number;
    isVisible: boolean;
}

interface StatCardProps {
    value: string;
    label: string;
    color: string;
    index: number;
    isVisible: boolean;
}

const features = [
    { icon: Zap, text: 'Instant delivery' },
    { icon: Shield, text: 'Secure payments' },
    { icon: Globe, text: 'Worldwide access' },
];

const stats = [
    { value: '100%', label: 'Secure', color: '#22c55e' },
    { value: 'Top', label: 'Brands', color: '#a855f7' },
    { value: 'Instant', label: 'Delivery', color: '#3b82f6' },
];

const FeatureBadge = memo(({ icon, text, index, isVisible }: FeatureBadgeProps) => {
    return (
        <HStack
            spacing={3}
            px={6}
            py={3}
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
            transition={`all 0.6s ease ${1.4 + (index * 0.2)}s`}
        >
            <Icon as={icon} w={5} h={5} color="green.400" />
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

const StatCard = memo(({ value, label, color, index, isVisible }: StatCardProps) => {
    return (
        <VStack
            spacing={2}
            textAlign="center"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)'}
            transition={`all 0.6s ease ${2.4 + (index * 0.2)}s`}
        >
            <Text
                fontSize={{ base: '1xl', md: '2xl', lg: '3xl' }}
                fontWeight="bold"
                fontFamily="Arial, Helvetica, sans-serif"
                color={color}
                lineHeight="1"
            >
                {value}
            </Text>
            <Text
                fontSize={{ base: 'xs', md: 'sm' }}
                fontFamily="Arial, Helvetica, sans-serif"
                color="white"
                fontWeight="medium"
                textTransform="uppercase"
                letterSpacing="0.05em"
                textAlign="center"
            >
                {label}
            </Text>
        </VStack>
    );
});

StatCard.displayName = 'StatCard';

const FinalCTASection = memo(() => {
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
            <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                width="500px"
                height="500px"
                borderRadius="50%"
                bg="linear-gradient(45deg, rgba(34, 197, 94, 0.05), rgba(168, 85, 247, 0.05))"
                filter="blur(120px)"
                opacity={0.4}
            />

            <Container maxW="6xl" position="relative" zIndex={1}>
                <VStack spacing={16}>
                    <Box
                        bg="linear-gradient(to bottom right, rgba(74, 222, 128, 0.1), rgba(168, 85, 247, 0.1), rgba(74, 222, 128, 0.1))"
                        border="1px solid"
                        borderColor="rgba(74, 222, 128, 0.3)"
                        borderRadius="xl"
                        p={{ base: 12, md: 16, lg: 20 }}
                        backdropFilter="blur(4px)"
                        textAlign="center"
                        position="relative"
                        overflow="hidden"
                        maxW="4xl"
                        mx="auto"
                        opacity={isVisible ? 1 : 0}
                        transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                        transition="all 0.8s ease 0.2s"
                    >
                        <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            width="80%"
                            height="80%"
                            borderRadius="2xl"
                            bg="linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(168, 85, 247, 0.1))"
                            filter="blur(40px)"
                            opacity={0.7}
                        />

                        <VStack position="relative" zIndex={1}>
                            <VStack
                                spacing={2}
                                mb={2}
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                                transition="all 0.6s ease 0.4s"
                            >
                                <Text
                                    fontSize={{ base: '2xl', md: '3xl', lg: '6xl' }}
                                    fontWeight="300"
                                    fontFamily="Arial, Helvetica, sans-serif"
                                    letterSpacing="-0.025em"
                                    color="white"
                                    lineHeight="1"
                                    textAlign="center"
                                >
                                    Start Shopping Gift Cards
                                </Text>
                                <HStack spacing={2} flexWrap="wrap" justify="center">
                                    <Text
                                        fontSize={{ base: '2xl', md: '3xl', lg: '6xl' }}
                                        fontWeight="300"
                                        fontFamily="Arial, Helvetica, sans-serif"
                                        letterSpacing="-0.025em"
                                        color="white"
                                        lineHeight="1"
                                    >
                                        with
                                    </Text>
                                    <Text
                                        fontSize={{ base: '2xl', md: '3xl', lg: '6xl' }}
                                        fontWeight="300"
                                        fontFamily="Arial, Helvetica, sans-serif"
                                        letterSpacing="-0.025em"
                                        lineHeight="1"
                                        bgGradient="linear(to-r, #22c55e, #a855f7)"
                                        bgClip="text"
                                    >
                                        Crypto
                                    </Text>
                                    <Text
                                        fontSize={{ base: '2xl', md: '3xl', lg: '6xl' }}
                                        fontWeight="300"
                                        fontFamily="Arial, Helvetica, sans-serif"
                                        letterSpacing="-0.025em"
                                        color="white"
                                        lineHeight="1"
                                    >
                                        on Hamza
                                    </Text>
                                </HStack>
                            </VStack>

                            <Text
                                fontSize="2xl"
                                fontWeight="300"
                                fontFamily="Arial, Helvetica, sans-serif"
                                color="white"
                                maxW="2xl"
                                lineHeight="2rem"
                                textAlign="center"
                                mx="auto"
                                mb={4}
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                                transition="all 0.6s ease 0.6s"
                            >
                                Join the decentralized marketplace revolution. Shop securely
                                with instant delivery and worldwide access.
                            </Text>

                            <HStack spacing={8} mb={8} flexWrap="wrap" justify="center">
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

                            <HStack
                                spacing={4}
                                flexDirection={{ base: 'column', md: 'row' }}
                                w="100%"
                                justify="center"
                                mb={8}
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                                transition="all 0.6s ease 1.0s"
                            >
                                <Link href="/en/category/gift-cards" passHref>
                                    <Button
                                        as="a"
                                        size="lg"
                                        bg="linear-gradient(to right, #4ade80, #22c55e)"
                                        color="black"
                                        fontWeight="500"
                                        fontFamily="Arial, Helvetica, sans-serif"
                                        px={10}
                                        py={5}
                                        fontSize="xl"
                                        lineHeight="1.75rem"
                                        borderRadius="full"
                                        h="2.75rem"
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
                                    >
                                        Shop Gift Cards
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
                                    py={5}
                                    fontSize="xl"
                                    lineHeight="1.75rem"
                                    borderRadius="full"
                                    bg="transparent"
                                    h="2.75rem"
                                    _hover={{
                                        borderColor: "purple.400",
                                        bg: "rgba(168, 85, 247, 0.2)",
                                        transform: "translateY(-2px)",
                                    }}
                                    _active={{
                                        transform: "translateY(0)",
                                    }}
                                    transition="all 0.3s ease"
                                >
                                    Learn More
                                </Button>
                            </HStack>

                            <HStack
                                spacing={8}
                                justify="center"
                                mb={8}
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                                transition="all 0.6s ease 1.8s"
                                flexWrap="wrap"
                            >
                                <Text
                                    fontSize={{ base: 'sm', md: 'md' }}
                                    fontWeight="light"
                                    fontFamily="Arial, Helvetica, sans-serif"
                                    color="gray.300"
                                >
                                    Decentralized marketplace
                                </Text>
                                <Text color="gray.500">|</Text>
                                <Text
                                    fontSize={{ base: 'sm', md: 'md' }}
                                    fontWeight="light"
                                    fontFamily="Arial, Helvetica, sans-serif"
                                    color="gray.300"
                                >
                                    Secure payments
                                </Text>
                                <Text color="gray.500">|</Text>
                                <Text
                                    fontSize={{ base: 'sm', md: 'md' }}
                                    fontWeight="light"
                                    fontFamily="Arial, Helvetica, sans-serif"
                                    color="gray.300"
                                >
                                    Worldwide access
                                </Text>
                            </HStack>

                            <Box
                                w="100%"
                                h="1px"
                                bg="gray.800"
                                mb={8}
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'scaleX(1)' : 'scaleX(0)'}
                                transition="all 0.6s ease 2.0s"
                            />

                            <SimpleGrid
                                columns={{ base: 1, md: 3 }}
                                spacing={{ base: 8, md: 16 }}
                                w="100%"
                                maxW="3xl"
                                mx="auto"
                            >
                                {stats.map((stat, index) => (
                                    <StatCard
                                        key={stat.label}
                                        value={stat.value}
                                        label={stat.label}
                                        color={stat.color}
                                        index={index}
                                        isVisible={isVisible}
                                    />
                                ))}
                            </SimpleGrid>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
});

FinalCTASection.displayName = 'FinalCTASection';

export default FinalCTASection;