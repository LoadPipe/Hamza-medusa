import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    SimpleGrid,
    Icon,
} from '@chakra-ui/react';
import { Shield, Zap, DollarSign, Globe } from 'lucide-react';

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    highlight: string;
    index: number;
    isVisible: boolean;
}

const features = [
    {
        icon: Shield,
        title: 'Secure Payments',
        description: 'Your cryptocurrency payments are processed securely with advanced encryption.',
        highlight: '100% Secure',
    },
    {
        icon: Zap,
        title: 'Instant Delivery',
        description: 'Receive your gift cards immediately after payment confirmation.',
        highlight: '< 5 Minutes',
    },
    {
        icon: DollarSign,
        title: 'No Hidden Fees',
        description: 'Transparent pricing with minimal network fees only.',
        highlight: 'Low Fees',
    },
    {
        icon: Globe,
        title: 'Global Access',
        description: 'Buy gift cards from anywhere in the world, no geographic restrictions.',
        highlight: 'Worldwide',
    },
];

const FeatureCard = memo(({ icon, title, description, highlight, index, isVisible }: FeatureCardProps) => {
    return (
        <Box
            bg="rgba(255, 255, 255, 0.02)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="xl"
            p={8}
            backdropFilter="blur(10px)"
            position="relative"
            overflow="hidden"
            role="group"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
            transition={`all 0.6s ease ${index * 0.2}s`}
            _hover={{
                borderColor: '#144B27',
                bg: 'rgba(255, 255, 255, 0.05)',
            }}
        >
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)"
                opacity={0}
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.3s ease"
            />

            <VStack spacing={6} align="center" position="relative" zIndex={1} h="100%" justify="space-between">
                {/* Icon */}
                <Box
                    w={16}
                    h={16}
                    borderRadius="xl"
                    bg="rgba(34, 197, 94, 0.1)"
                    border="1px solid rgba(34, 197, 94, 0.3)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    _hover={{
                        transform: "scale(1.1)"
                    }}
                    transition="transform 0.3s ease"
                >
                    <Icon as={icon} w={8} h={8} color="green.400" />
                </Box>

                {/* Content */}
                <VStack spacing={4} align="center" w="100%" textAlign="center" flex="1">
                    <Text
                        fontSize="xl"
                        fontWeight="500"
                        fontFamily="Arial, Helvetica, sans-serif"
                        letterSpacing="0.025em"
                        lineHeight="1.75rem"
                        color="#FFFFFF"
                    >
                        {title}
                    </Text>

                    <Box
                        w="40px"
                        h="1px"
                        bg="gray.700"
                        _groupHover={{ bg: "green.400" }}
                        transition="background-color 0.3s ease"
                    />

                    <Text
                        fontSize="md"
                        fontFamily="Arial, Helvetica, sans-serif"
                        letterSpacing="0.025em"
                        color="gray.400"
                        lineHeight="1.5rem"
                    >
                        {description}
                    </Text>
                </VStack>

                {/* Bottom section */}
                <VStack spacing={4} align="center" w="100%">
                    <Box
                        w="100%"
                        h="1px"
                        bg="gray.800"
                    />

                    {/* Highlight Badge */}
                    <Text
                        fontSize="xl"
                        fontWeight="bold"
                        fontFamily="Arial, Helvetica, sans-serif"
                        lineHeight="2rem"
                        color="#4ADE80"
                    >
                        {highlight}
                    </Text>
                </VStack>
            </VStack>
        </Box>
    );
});

FeatureCard.displayName = 'FeatureCard';

const WhyChooseSection = memo(() => {
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
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                width="600px"
                height="600px"
                borderRadius="50%"
                bg="linear-gradient(45deg, rgba(34, 197, 94, 0.05), rgba(168, 85, 247, 0.05))"
                filter="blur(150px)"
                opacity={0.6}
            />

            <Container maxW="6xl" position="relative" zIndex={1}>
                <VStack spacing={16}>
                    {/* Section Header */}
                    <VStack spacing={6} textAlign="center">
                        <Text
                            fontSize="sm"
                            fontWeight="light"
                            letterSpacing="0.2em"
                            textTransform="uppercase"
                            color="gray.500"
                            fontFamily="Arial, Helvetica, sans-serif"
                            lineHeight="1.25rem"
                            opacity={isVisible ? 1 : 0}
                            transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                            transition="all 0.6s ease 0.2s"
                        >
                            Why Choose Hamza
                        </Text>

                        <VStack spacing={4} mb={16}>
                            <Text
                                fontSize={{ base: '2xl', md: '3xl', lg: '60px' }}
                                fontWeight="light"
                                color="white"
                                lineHeight="1"
                                fontFamily="Arial, Helvetica, sans-serif"
                                letterSpacing="-0.025em"
                                mb={2}
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                                transition="all 0.6s ease 0.4s"
                            >
                                The <Text as="span" color="#4ADE80">Smart</Text> Way to Buy Gift Cards
                            </Text>

                            <Text
                                fontSize={{ base: 'lg', md: 'xl' }}
                                fontWeight="300"
                                letterSpacing="0.025em"
                                fontFamily="Arial, Helvetica, sans-serif"
                                color="#d1d5db"
                                maxW="3xl"
                                lineHeight="1.6rem"
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                                transition="all 0.6s ease 0.6s"
                            >
                                Experience the future of gift card purchases with cryptocurrency payments,
                                secure transactions, and instant delivery on the Hamza marketplace.
                            </Text>
                        </VStack>
                    </VStack>

                    {/* Feature Cards Grid */}
                    <SimpleGrid
                        columns={{ base: 1, md: 2, lg: 4 }}
                        spacing={{ base: 6, md: 8 }}
                        w="100%"
                    >
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={feature.title}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                highlight={feature.highlight}
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

WhyChooseSection.displayName = 'WhyChooseSection';

export default WhyChooseSection;