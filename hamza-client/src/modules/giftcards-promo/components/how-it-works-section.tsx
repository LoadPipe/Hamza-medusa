import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    HStack,
    SimpleGrid,
    Icon,
    Flex,
} from '@chakra-ui/react';
import {
    Search,
    CreditCard,
    Zap,
    Gift,
    ArrowRight,
    ArrowDown,
} from 'lucide-react';

interface StepCardProps {
    stepNumber: string;
    icon: React.ElementType;
    title: string;
    description: string;
    showArrow?: boolean;
    arrowIndex?: number;
    index: number;
    isVisible: boolean;
}

const steps = [
    {
        stepNumber: 'Step 1',
        icon: Search,
        title: 'Choose Your Brand',
        description: 'Browse thousands of gift cards from popular brands like Amazon, Apple, Steam, and more',
    },
    {
        stepNumber: 'Step 2',
        icon: CreditCard,
        title: 'Select Amount & Pay',
        description: 'Choose your gift card value and pay with Bitcoin, Ethereum, USDT, or other cryptocurrencies',
    },
    {
        stepNumber: 'Step 3',
        icon: Zap,
        title: 'Instant Delivery',
        description: 'Receive your gift card code instantly via email - no waiting, no delays',
    },
    {
        stepNumber: 'Step 4',
        icon: Gift,
        title: 'Redeem & Enjoy',
        description: 'Use your gift card immediately at your chosen retailer or save it for later',
    },
];

const StepCard = memo(({ stepNumber, icon, title, description, showArrow = false, index, isVisible }: StepCardProps) => {
    const [isIconHovered, setIsIconHovered] = useState(false);
    const [isTextHovered, setIsTextHovered] = useState(false);

    const handleIconMouseEnter = useCallback(() => setIsIconHovered(true), []);
    const handleIconMouseLeave = useCallback(() => setIsIconHovered(false), []);
    const handleTextMouseEnter = useCallback(() => setIsTextHovered(true), []);
    const handleTextMouseLeave = useCallback(() => setIsTextHovered(false), []);

    return (
        <>
            {/* Desktop Layout */}
            <Flex align="flex-start" w="100%" display={{ base: 'none', lg: 'flex' }}>
                <VStack
                    spacing={6}
                    flex={1}
                    textAlign="center"
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                    transition={`all 0.6s ease ${1.2 + (index * 0.2)}s`}
                >
                    <Box position="relative">
                        <Box
                            w={20}
                            h={20}
                            borderRadius="xl"
                            bgGradient="linear(to-br, purple.300, purple.500)"
                            bg={isIconHovered ? "#441E67" : "rgba(192, 132, 252, 0.2)"}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            position="relative"
                            zIndex={10}
                            mx="auto"
                            onMouseEnter={handleIconMouseEnter}
                            onMouseLeave={handleIconMouseLeave}
                            cursor="pointer"
                            transform={isIconHovered ? "scale(1.1)" : "scale(1)"}
                            transition="all 0.3s ease"
                        >
                            <Icon
                                as={icon}
                                w={10}
                                h={10}
                                color="#C084FC"
                            />
                        </Box>
                    </Box>

                    <VStack
                        spacing={4}
                        maxW="280px"
                        onMouseEnter={handleTextMouseEnter}
                        onMouseLeave={handleTextMouseLeave}
                        cursor="pointer"
                        transform={isTextHovered ? "translateY(-8px)" : "translateY(0)"}
                        transition="all 0.3s ease"
                    >
                        <Text
                            fontSize="sm"
                            fontWeight="500"
                            fontFamily="Arial, Helvetica, sans-serif"
                            color="purple.300"
                            letterSpacing="0.1em"
                            textTransform="uppercase"
                            lineHeight="1.25rem"
                        >
                            {stepNumber}
                        </Text>

                        <Text
                            fontSize={{ base: 'lg', md: 'xl' }}
                            fontWeight="bold"
                            color="white"
                            lineHeight="1.3"
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
                            fontSize={{ base: 'sm', md: 'md' }}
                            fontFamily="Arial, Helvetica, sans-serif"
                            letterSpacing="0.025em"
                            color="gray.400"
                            lineHeight="1.625"
                            textAlign="center"
                            px={2}
                        >
                            {description}
                        </Text>
                    </VStack>
                </VStack>

                {showArrow && (
                    <Box
                        display="flex"
                        alignItems="flex-start"
                        justifyContent="center"
                        w={16}
                        h={20}
                        mt={3}
                        opacity={isVisible ? 0.6 : 0}
                        transition={`all 0.6s ease ${1.4 + (index * 0.2)}s`}
                    >
                        <Icon
                            as={ArrowRight}
                            w={6}
                            h={6}
                            color="gray.400"
                            mt={7}
                            sx={{
                                animation: `slideArrowX 2s ease-in-out infinite`,
                                '@keyframes slideArrowX': {
                                    '0%, 100%': {
                                        transform: 'translateX(0px)',
                                    },
                                    '50%': {
                                        transform: 'translateX(7px)',
                                    },
                                },
                            }}
                        />
                    </Box>
                )}
            </Flex>

            {/* Mobile Layout */}
            <VStack spacing={6} w="100%" display={{ base: 'flex', lg: 'none' }}>
                <HStack
                    spacing={4}
                    w="100%"
                    align="flex-start"
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                    transition={`all 0.6s ease ${1.2 + (index * 0.2)}s`}
                >
                    <Box
                        w={16}
                        h={16}
                        borderRadius="xl"
                        bg="rgba(192, 132, 252, 0.2)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                    >
                        <Icon
                            as={icon}
                            w={8}
                            h={8}
                            color="#C084FC"
                        />
                    </Box>

                    <VStack spacing={2} align="flex-start" flex={1}>
                        <Text
                            fontSize="xs"
                            fontWeight="500"
                            fontFamily="Arial, Helvetica, sans-serif"
                            color="purple.300"
                            letterSpacing="0.1em"
                            textTransform="uppercase"
                        >
                            {stepNumber}
                        </Text>

                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color="white"
                            lineHeight="1.3"
                        >
                            {title}
                        </Text>

                        <Box
                            w="40px"
                            h="1px"
                            bg="gray.700"
                        />

                        <Text
                            fontSize="sm"
                            fontFamily="Arial, Helvetica, sans-serif"
                            letterSpacing="0.025em"
                            color="gray.400"
                            lineHeight="1.5"
                        >
                            {description}
                        </Text>
                    </VStack>
                </HStack>

                {showArrow && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        w="100%"
                        opacity={isVisible ? 0.6 : 0}
                        transition={`all 0.6s ease ${1.4 + (index * 0.2)}s`}
                    >
                        <Icon
                            as={ArrowDown}
                            w={6}
                            h={6}
                            color="gray.400"
                            sx={{
                                animation: `slideArrowY 2s ease-in-out infinite`,
                                '@keyframes slideArrowY': {
                                    '0%, 100%': {
                                        transform: 'translateY(0px)',
                                    },
                                    '50%': {
                                        transform: 'translateY(7px)',
                                    },
                                },
                            }}
                        />
                    </Box>
                )}
            </VStack>
        </>
    );
});

StepCard.displayName = 'StepCard';

const HowItWorksSection = memo(() => {
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
            pb={{ base: 28, md: 48 }}
            bg="black"
            position="relative"
        >
            <Container maxW="7xl" position="relative" zIndex={1}>
                <VStack spacing={6}>
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
                            Simple Process
                        </Text>

                        <VStack spacing={4}>
                            <Text
                                fontSize={{ base: '3xl', md: '3xl', lg: '6xl' }}
                                fontWeight="300"
                                fontFamily="Arial, Helvetica, sans-serif"
                                letterSpacing="-0.025em"
                                color="white"
                                lineHeight="1"
                                px={2}
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                                transition="all 0.6s ease 0.4s"
                            >
                                How It <Text as="span" bgGradient="linear(to-r, #8b5cf6, #a855f7)" bgClip="text">Works</Text>
                            </Text>

                            <Text
                                fontSize={{ base: 'lg', md: 'xl' }}
                                fontFamily="Arial, Helvetica, sans-serif"
                                fontWeight="300"
                                letterSpacing="0.025em"
                                color="#D1D5DB"
                                maxW="2xl"
                                lineHeight="2rem"
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                                transition="all 0.6s ease 0.6s"
                            >
                                Get your favorite gift cards in just 4 simple steps. Fast, secure, and
                                completely private.
                            </Text>
                        </VStack>
                    </VStack>

                    <Box
                        w={{ base: "5rem", sm: "6rem" }}
                        h="1px"
                        bgGradient="linear(to-r, transparent, #c084fc, transparent)"
                        mx="auto"
                        mb={{ base: 12, md: 20 }}
                        opacity={isVisible ? 1 : 0}
                        transform={isVisible ? 'scaleX(1)' : 'scaleX(0)'}
                        transition="all 0.6s ease 0.8s"
                    />

                    {/* Desktop View */}
                    <Box display={{ base: 'none', lg: 'block' }} w="100%">
                        <HStack spacing={0} justify="space-between" align="flex-start">
                            {steps.map((step, index) => (
                                <StepCard
                                    key={step.stepNumber}
                                    stepNumber={step.stepNumber}
                                    icon={step.icon}
                                    title={step.title}
                                    description={step.description}
                                    showArrow={index < steps.length - 1}
                                    arrowIndex={index}
                                    index={index}
                                    isVisible={isVisible}
                                />
                            ))}
                        </HStack>
                    </Box>

                    {/* Mobile View */}
                    <VStack spacing={8} w="100%" display={{ base: 'flex', lg: 'none' }}>
                        {steps.map((step, index) => (
                            <StepCard
                                key={step.stepNumber}
                                stepNumber={step.stepNumber}
                                icon={step.icon}
                                title={step.title}
                                description={step.description}
                                showArrow={index < steps.length - 1}
                                arrowIndex={index}
                                index={index}
                                isVisible={isVisible}
                            />
                        ))}
                    </VStack>
                </VStack>
            </Container>
        </Box>
    );
});

HowItWorksSection.displayName = 'HowItWorksSection';

export default HowItWorksSection;