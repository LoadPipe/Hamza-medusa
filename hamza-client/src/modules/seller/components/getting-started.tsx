import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
    VStack,
    Text,
    SimpleGrid,
    HStack,
    Icon,
    Button,
    Flex,
    Link,
} from '@chakra-ui/react';
import { CheckCircle, Clock, Wallet, Store, Upload, Rocket } from 'lucide-react';

interface StepCardProps {
    step: number;
    icon: React.ElementType;
    title: string;
    description: string;
    time: string;
    index: number;
    isVisible: boolean;
}

interface InfoCardProps {
    title: string;
    items: Array<{ text: string; available?: boolean; description?: string }>;
    isVisible: boolean;
    index: number;
    borderColor: string;
}

const onboardingSteps = [
    {
        step: 1,
        title: "Quick Registration",
        description: "Create your seller account in under 2 minutes",
        icon: Wallet,
        time: "2 min",
        status: "easy",
    },
    {
        step: 2,
        title: "Store Setup",
        description: "Customize your storefront and add your first products",
        icon: Store,
        time: "15 min",
        status: "easy",
    },
    {
        step: 3,
        title: "Verification",
        description: "Complete identity verification for enhanced trust",
        icon: CheckCircle,
        time: "24 hrs",
        status: "medium",
    },
    {
        step: 4,
        title: "Start Selling",
        description: "Go live and start receiving orders immediately",
        icon: Rocket,
        time: "Instant",
        status: "easy",
    },
];

const requirements = [
    { text: "Valid government-issued ID" },
    { text: "Business registration (if applicable)" },
    { text: "Bank account or crypto wallet" },
    { text: "Product photos and descriptions" },
];

const support = [
    {
        text: "No upfront costs or monthly fees",
        description: "",
        available: true,
    },
    {
        text: "Dedicated seller support team",
        description: "",
        available: true,
    },
    {
        text: "Marketing tools and analytics",
        description: "",
        available: true,
    },
    {
        text: "Global payment processing",
        description: "",
        available: true,
    },
];

const StepCard = memo(({ step, icon, title, description, time, index, isVisible }: StepCardProps) => {
    return (
        <Box
            position="relative"
            role="group"
            _hover={{
                transform: 'translateY(-4px)',
            }}
            transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
            style={{
                transition: `all 0.6s ease ${1.2 + (index * 0.2)}s, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
        >
            {/* Step Number - Top Right */}
            <Box
                position="absolute"
                top={{ base: 3, sm: 4 }}
                right={{ base: 3, sm: 4 }}
                w={{ base: 6, sm: 8 }}
                h={{ base: 6, sm: 8 }}
                bg="rgba(34, 197, 94, 0.2)"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="green.400"
                fontWeight="bold"
                fontSize={{ base: 'xs', sm: 'sm' }}
                zIndex={1}
            >
                {step}
            </Box>

            <Box
                bg="rgba(0, 0, 0, 0.5)"
                backdropFilter="blur(4px)"
                border="1px solid"
                borderColor="gray.800"
                borderRadius={{ base: 'xl', sm: '2xl' }}
                h="full"
                _groupHover={{
                    borderColor: 'rgba(168, 85, 247, 0.6)',
                    boxShadow: '0 10px 25px rgba(168, 85, 247, 0.15)'
                }}
                transition="border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                style={{
                    boxSizing: 'border-box',
                    WebkitTextSizeAdjust: '100%',
                    tabSize: 4,
                    fontFeatureSettings: 'normal',
                    fontVariationSettings: 'normal',
                    WebkitTapHighlightColor: 'transparent',
                    lineHeight: 'inherit',
                    fontFamily: 'Arial, Helvetica, sans-serif',
                }}
            >
                <VStack
                    spacing={{ base: 4, sm: 6 }}
                    p={{ base: 4, sm: 6, lg: 8 }}
                    textAlign="center"
                    h="full"
                >

                    {/* Icon */}
                    <Box
                        w={{ base: '48px', sm: '64px' }}
                        h={{ base: '48px', sm: '64px' }}
                        mx="auto"
                        bgGradient="linear(to-br, rgba(74, 222, 128, 0.2), rgba(168, 85, 247, 0.2))"
                        borderRadius={{ base: 'xl', sm: '2xl' }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        _groupHover={{ transform: 'scale(1.1)' }}
                        transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        style={{
                            transitionProperty: 'transform',
                            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                            transitionDuration: '0.3s',
                            animationDuration: '0.3s'
                        }}
                    >
                        <Icon as={icon} w={{ base: 6, sm: 8 }} h={{ base: 6, sm: 8 }} color="green.400" />
                    </Box>

                    <Box
                        w={{ base: '24px', sm: '32px' }}
                        h="1px"
                        bg="gray.700"
                        _groupHover={{ bg: 'green.400' }}
                        transition="background 0.3s"
                    />

                    {/* Content */}
                    <VStack spacing={{ base: 2, sm: 3 }}>
                        <Text
                            fontSize={{ base: 'base', sm: 'lg' }}
                            fontWeight="medium"
                            color="white"
                        >
                            {title}
                        </Text>
                        <Text
                            color="gray.400"
                            fontSize={{ base: 'xs', sm: 'sm' }}
                            lineHeight="relaxed"
                        >
                            {description}
                        </Text>
                    </VStack>

                    {/* Time */}
                    <Flex alignItems="center" gap={{ base: 1, sm: 2 }}>
                        <Icon as={Clock} w={{ base: 3, sm: 4 }} h={{ base: 3, sm: 4 }} color="green.400" />
                        <Text
                            color="green.400"
                            fontSize={{ base: 'xs', sm: 'sm' }}
                            fontWeight="medium"
                        >
                            {time}
                        </Text>
                    </Flex>
                </VStack>
            </Box>
        </Box>
    );
});

StepCard.displayName = 'StepCard';

const InfoCard = memo(({ title, items, isVisible, index, borderColor }: InfoCardProps) => {
    return (
        <Box
            bg="rgba(0, 0, 0, 0.5)"
            backdropFilter="blur(4px)"
            border="1px solid"
            borderColor="gray.800"
            borderRadius={{ base: 'xl', sm: '2xl' }}
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
            style={{
                transition: `all 0.6s ease ${2.0 + (index * 0.2)}s`
            }}
        >
            <VStack spacing={{ base: 6, sm: 8 }} p={{ base: 6, sm: 8, lg: 10 }} align="start" h="full">
                <VStack spacing={{ base: 3, sm: 4 }} align="start">
                    <Text
                        fontSize={{ base: 'lg', sm: 'xl', lg: '2xl' }}
                        fontWeight="medium"
                        color="white"
                    >
                        {title}
                    </Text>
                    <Box
                        w={{ base: '24px', sm: '32px' }}
                        h="1px"
                        bg={title === "What You'll Need" ? "rgb(192 132 252)" : "rgb(74 222 128)"}
                        _groupHover={{ bg: 'green.400' }}
                        transition="background 0.3s"
                    />

                    <Text
                        color="gray.400"
                        fontSize={{ base: 'xs', sm: 'sm' }}
                        lineHeight="relaxed"
                    >
                        {title === "What You'll Need" ? "Simple requirements to get started" : "Everything you need to succeed"}
                    </Text>
                </VStack>

                <VStack spacing={{ base: 3, sm: 4 }} align="start" flex="1" w="full">
                    {items.map((item, idx) => (
                        <Flex key={idx} alignItems="start" gap={{ base: 2, sm: 3 }} w="full">
                            <Box
                                w={{ base: 4, sm: 5 }}
                                h={{ base: 4, sm: 5 }}
                                borderRadius="full"
                                bg={
                                    item.available !== false
                                        ? "rgba(34, 197, 94, 0.2)"
                                        : "rgba(128, 128, 128, 0.2)"
                                }
                                border="1px solid"
                                borderColor={
                                    item.available !== false
                                        ? "rgba(34, 197, 94, 0.3)"
                                        : "rgba(128, 128, 128, 0.3)"
                                }
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink={0}
                                mt={0.5}
                            >
                                <Icon
                                    as={CheckCircle}
                                    w={{ base: 3, sm: 4 }}
                                    h={{ base: 3, sm: 4 }}
                                    color={item.available !== false ? "green.400" : "gray.500"}
                                />
                            </Box>
                            <Box flex="1">
                                <Text
                                    fontSize={{ base: 'sm', sm: 'base' }}
                                    color={item.available !== false ? "white" : "gray.500"}
                                    fontWeight={item.description ? "medium" : "normal"}
                                >
                                    {item.text}
                                </Text>
                                {item.description && (
                                    <Text
                                        fontSize={{ base: 'xs', sm: 'sm' }}
                                        color={item.available !== false ? "gray.400" : "gray.600"}
                                        mt={1}
                                    >
                                        {item.description}
                                    </Text>
                                )}
                            </Box>
                        </Flex>
                    ))}
                </VStack>

                {title === "What You Need" && (
                    <Box pt={{ base: 4, sm: 6 }} borderTop="1px solid" borderColor="gray.800" w="full">
                        <Text
                            color="gray.400"
                            fontSize={{ base: 'xs', sm: 'sm' }}
                            lineHeight="relaxed"
                        >
                            Most sellers complete the entire setup process in under 30 minutes.
                        </Text>
                    </Box>
                )}
            </VStack>
        </Box>
    );
});

InfoCard.displayName = 'InfoCard';

const GettingStartedSection = memo(() => {
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
            maxW="1200px"
            mx="auto"
            px={{ base: 3, sm: 4 }}
            position="relative"
            zIndex={1}
        >
            {/* Section Header */}
            <VStack spacing={0} textAlign="center" mb={{ base: 12, sm: 16, lg: 20, xl: 32 }}>
                <Text
                    color="gray.500"
                    fontSize={{ base: 'xs', sm: 'sm' }}
                    fontWeight="300"
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    mb={{ base: 3, sm: 4, lg: 6 }}
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                    transition="all 0.6s ease 0.2s"
                >
                    Getting Started
                </Text>

                <Text
                    fontSize={{ base: '2xl', sm: '3xl', md: '4xl', lg: '5xl', xl: '6xl' }}
                    fontWeight="300"
                    color="white"
                    mb={{ base: 4, sm: 6, lg: 8 }}
                    letterSpacing="-0.025em"
                    lineHeight="1.1"
                    px={2}
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                    transition="all 0.6s ease 0.4s"
                >
                    Start Selling in <Text as="span" color="purple.400" fontWeight="medium">Minutes</Text>
                </Text>

                <Box maxW="3xl" mx="auto" px={2}>
                    <Text
                        fontSize={{ base: 'sm', sm: 'base', md: 'lg', lg: 'xl', xl: '2xl' }}
                        fontWeight="300"
                        lineHeight="relaxed"
                        color="gray.300"
                        letterSpacing="wide"
                        opacity={isVisible ? 1 : 0}
                        transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                        transition="all 0.6s ease 0.6s"
                    >
                        Our streamlined onboarding process gets you selling faster than any traditional marketplace.
                    </Text>
                </Box>

                <Box
                    w={{ base: '48px', sm: '64px', lg: '96px' }}
                    h="1px"
                    bgGradient="linear(to-r, transparent, purple.400, transparent)"
                    mx="auto"
                    mt={{ base: 4, sm: 6, lg: 8 }}
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'scaleX(1)' : 'scaleX(0)'}
                    transition="all 0.6s ease 0.8s"
                />
            </VStack>

            {/* Onboarding Steps */}
            <Box mb={{ base: 12, sm: 16, lg: 24 }}>
                <SimpleGrid
                    columns={{ base: 1, sm: 2, lg: 4 }}
                    spacing={{ base: 4, sm: 6, lg: 8 }}
                >
                    {onboardingSteps.map((step, index) => (
                        <StepCard
                            key={step.step}
                            step={step.step}
                            icon={step.icon}
                            title={step.title}
                            description={step.description}
                            time={step.time}
                            index={index}
                            isVisible={isVisible}
                        />
                    ))}
                </SimpleGrid>
            </Box>

            {/* Requirements and Support */}
            <SimpleGrid
                columns={{ base: 1, lg: 2 }}
                spacing={{ base: 6, sm: 8, lg: 12 }}
                mb={{ base: 12, sm: 16, lg: 24 }}
            >
                <InfoCard
                    title="What You'll Need"
                    items={requirements}
                    isVisible={isVisible}
                    index={0}
                    borderColor="purple.400"
                />
                <InfoCard
                    title="What You'll Get"
                    items={support}
                    isVisible={isVisible}
                    index={1}
                    borderColor="green.400"
                />
            </SimpleGrid>

            {/* CTA Section */}
            <Box textAlign="center">
                <Box
                    bgGradient="linear(to-r, rgba(168, 85, 247, 0.1), rgba(34, 197, 94, 0.1))"
                    border="1px solid rgba(168, 85, 247, 0.3)"
                    borderRadius={{ base: 'xl', sm: '2xl' }}
                    maxW="3xl"
                    mx="auto"
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                    transition="all 0.6s ease 2.6s"
                >
                    <VStack spacing={{ base: 6, sm: 8 }} p={{ base: 6, sm: 8, lg: 12 }}>
                        <VStack spacing={{ base: 3, sm: 4 }}>
                            <Text
                                fontSize={{ base: 'xl', sm: '2xl', lg: '3xl' }}
                                fontWeight="300"
                                color="white"
                            >
                                Ready to Get Started?
                            </Text>
                            <Text
                                color="gray.300"
                                lineHeight="relaxed"
                                fontSize={{ base: 'sm', sm: 'base' }}
                                maxW="2xl"
                                mx="auto"
                            >
                                Join thousands of sellers who have already made the switch to decentralized
                                commerce.
                            </Text>
                        </VStack>

                        <Flex
                            direction={{ base: 'column', sm: 'row' }}
                            gap={{ base: 3, sm: 4 }}
                            justify="center"
                            align="center"
                        >
                            <Link href="https://admin.hamza.market/" isExternal>
                                <Button
                                    as="span"
                                    size="lg"
                                    w={{ base: 'full', sm: 'auto' }}
                                    bgGradient="linear(to-r, #10b981, #059669)"
                                    color="white"
                                    px={{ base: 6, sm: 8 }}
                                    py={{ base: 2, sm: 3 }}
                                    borderRadius="full"
                                    fontWeight="medium"
                                    fontSize={{ base: 'sm', sm: 'base' }}
                                    _hover={{
                                        bgGradient: "linear(to-r, #059669, #047857)",
                                        transform: 'scale(1.05)',
                                    }}
                                    transition="all 0.3s"
                                    cursor="pointer"
                                >
                                    Start Onboarding
                                </Button>
                            </Link>

                            <Button
                                size="lg"
                                variant="outline"
                                w={{ base: 'full', sm: 'auto' }}
                                borderColor="purple.400"
                                color="purple.400"
                                px={{ base: 6, sm: 8 }}
                                py={{ base: 2, sm: 3 }}
                                borderRadius="full"
                                bg="transparent"
                                fontSize={{ base: 'sm', sm: 'base' }}
                                _hover={{
                                    borderColor: "purple.300",
                                    color: "purple.300",
                                }}
                            >
                                Schedule Demo
                            </Button>
                        </Flex>

                        <Box pt={{ base: 4, sm: 6 }} borderTop="1px solid rgba(128, 128, 128, 0.5)">
                            <Text
                                color="gray.500"
                                fontSize={{ base: 'xs', sm: 'sm' }}
                            >
                                No setup fees • No monthly charges • Start earning immediately
                            </Text>
                        </Box>
                    </VStack>
                </Box>
            </Box>
        </Box>
    );
});

GettingStartedSection.displayName = 'GettingStartedSection';

export default GettingStartedSection;