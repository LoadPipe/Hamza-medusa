import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
    VStack,
    Text,
    HStack,
    Icon,
    Flex,
} from '@chakra-ui/react';
import {
    Store,
    Upload,
    CreditCard,
    Package,
    TrendingUp,
    Gift,
    ArrowRight,
    ArrowDown,
} from 'lucide-react';

interface StepCardProps {
    id: number;
    icon: React.ElementType;
    title: string;
    description: string;
    index: number;
    isVisible: boolean;
    showArrow?: boolean;
}

const sellingSteps = [
    {
        id: 1,
        title: "Create Your Store",
        description: "Set up your decentralized storefront in minutes",
        icon: Store,
    },
    {
        id: 2,
        title: "List Your Products",
        description: "Upload products with photos and descriptions",
        icon: Upload,
    },
    {
        id: 3,
        title: "Receive Orders",
        description: "Customers place orders with crypto payments",
        icon: CreditCard,
    },
    {
        id: 4,
        title: "Ship Products",
        description: "Fulfill orders and provide tracking information",
        icon: Package,
    },
    {
        id: 5,
        title: "Get Paid Instantly",
        description: "Receive payments immediately upon delivery confirmation",
        icon: TrendingUp,
    },
    {
        id: 6,
        title: "Earn DECOM Rewards",
        description: "Get bonus tokens for successful transactions",
        icon: Gift,
    },
];

const StepCard = memo(({ id, icon, title, description, index, isVisible, showArrow }: StepCardProps) => {
    return (
        <>
            {/* Desktop Layout */}
            <Box position="relative" display={{ base: 'none', lg: 'flex' }} flexDirection="column" alignItems="center">
                <Box position="relative" zIndex={10}>
                    <Box
                        bgGradient="linear(to-br, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.2))"
                        borderRadius={{ base: 'xl', xl: '2xl' }}
                        w={{ base: '64px', xl: '96px' }}
                        h={{ base: '64px', xl: '96px' }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mx="auto"
                        mb={{ base: 6, xl: 8 }}
                        _hover={{ transform: 'scale(1.1)' }}
                        transition="transform 0.3s"
                        opacity={isVisible ? 1 : 0}
                        transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                        style={{
                            transition: `all 0.6s ease ${1.2 + (index * 0.2)}s, transform 0.3s`
                        }}
                    >
                        <Icon as={icon} w={{ base: 8, xl: 12 }} h={{ base: 8, xl: 12 }} color="purple.400" />
                    </Box>
                </Box>

                {showArrow && (
                    <Box
                        position="absolute"
                        top={{ base: 8, xl: 12 }}
                        right={{ base: -2, xl: -3 }}
                        transform="translateY(-50%)"
                        zIndex={0}
                        opacity={isVisible ? 1 : 0}
                        transition={`all 0.6s ease ${1.4 + (index * 0.2)}s`}
                    >
                        <Box
                            sx={{
                                animation: 'pulse 1.5s infinite',
                                '@keyframes pulse': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.5 },
                                },
                            }}
                        >
                            <Icon as={ArrowRight} w={{ base: 5, xl: 6 }} h={{ base: 5, xl: 6 }} color="gray.600" />
                        </Box>
                    </Box>
                )}

                <Box
                    textAlign="center"
                    w="full"
                    _hover={{ transform: 'translateY(-8px)' }}
                    transition="transform 0.3s"
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                    style={{
                        transition: `all 0.6s ease ${1.4 + (index * 0.2)}s, transform 0.3s`
                    }}
                >
                    <VStack spacing={{ base: 3, xl: 4 }}>
                        <Text
                            color="purple.400"
                            fontSize={{ base: 'xs', xl: 'sm' }}
                            fontWeight="medium"
                            letterSpacing="0.1em"
                            textTransform="uppercase"
                        >
                            Step {id}
                        </Text>
                        <Text
                            color="white"
                            fontWeight="medium"
                            fontSize={{ base: 'sm', xl: 'lg' }}
                            lineHeight="tight"
                            letterSpacing="wide"
                            px={2}
                        >
                            {title}
                        </Text>
                        <Box w={{ base: 6, xl: 8 }} h="1px" bg="gray.700" mx="auto" />
                        <Text
                            color="gray.400"
                            fontSize={{ base: 'xs', xl: 'sm' }}
                            lineHeight="relaxed"
                            letterSpacing="wide"
                            px={2}
                        >
                            {description}
                        </Text>
                    </VStack>
                </Box>
            </Box>

            {/* Mobile & Tablet Layout */}
            <Box display={{ base: 'block', lg: 'none' }} position="relative">
                <Flex alignItems="start" gap={{ base: 3, sm: 4, md: 6 }}>
                    <Box position="relative" zIndex={10} flexShrink={0}>
                        <Box
                            bgGradient="linear(to-br, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.2))"
                            borderRadius={{ base: 'lg', sm: 'xl', md: '2xl' }}
                            w={{ base: '48px', sm: '64px', md: '72px' }}
                            h={{ base: '48px', sm: '64px', md: '72px' }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            _hover={{ transform: 'scale(1.1)' }}
                            transition="transform 0.3s"
                            opacity={isVisible ? 1 : 0}
                            transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                            style={{
                                transition: `all 0.6s ease ${1.2 + (index * 0.2)}s, transform 0.3s`
                            }}
                        >
                            <Icon as={icon} w={{ base: 6, sm: 8, md: 9 }} h={{ base: 6, sm: 8, md: 9 }} color="purple.400" />
                        </Box>
                    </Box>

                    <Box
                        flex={1}
                        pt={{ base: 1, sm: 2 }}
                        _hover={{ transform: 'translateX(8px)' }}
                        transition="transform 0.3s"
                        opacity={isVisible ? 1 : 0}
                        transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                        style={{
                            transition: `all 0.6s ease ${1.4 + (index * 0.2)}s, transform 0.3s`
                        }}
                    >
                        <VStack spacing={{ base: 2, sm: 3, md: 4 }} align="start">
                            <Text
                                color="purple.400"
                                fontSize={{ base: 'xs', sm: 'sm' }}
                                fontWeight="medium"
                                letterSpacing="0.1em"
                                textTransform="uppercase"
                            >
                                Step {id}
                            </Text>
                            <Text
                                color="white"
                                fontWeight="medium"
                                fontSize={{ base: 'sm', sm: 'base', md: 'lg', xl: 'xl' }}
                                lineHeight="tight"
                                letterSpacing="wide"
                            >
                                {title}
                            </Text>
                            <Box w={{ base: 6, sm: 8, md: 12 }} h="1px" bg="gray.700" />
                            <Text
                                color="gray.400"
                                fontSize={{ base: 'xs', sm: 'sm', md: 'base' }}
                                lineHeight="relaxed"
                                letterSpacing="wide"
                                pr={2}
                            >
                                {description}
                            </Text>
                        </VStack>
                    </Box>
                </Flex>

                {showArrow && (
                    <Flex
                        justify="center"
                        mt={{ base: 4, sm: 6, md: 8 }}
                        ml={{ base: 6, sm: 8, md: 10 }}
                        opacity={isVisible ? 1 : 0}
                        transition={`all 0.6s ease ${1.6 + (index * 0.2)}s`}
                    >
                        <Box
                            sx={{
                                animation: 'bounce 1.5s infinite',
                                '@keyframes bounce': {
                                    '0%, 100%': { transform: 'translateY(0)' },
                                    '50%': { transform: 'translateY(12px)' },
                                },
                            }}
                        >
                            <Icon as={ArrowDown} w={{ base: 4, sm: 5, md: 6 }} h={{ base: 4, sm: 5, md: 6 }} color="gray.600" />
                        </Box>
                    </Flex>
                )}
            </Box>
        </>
    );
});

StepCard.displayName = 'StepCard';

const HowSellingWorksSection = memo(() => {
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
                    Selling Process
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
                    How <Text as="span" color="purple.400" fontWeight="medium">Selling</Text> Works
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
                        Start selling in 6 simple steps and join the decentralized commerce revolution.
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

            {/* Desktop Flow */}
            <Box display={{ base: 'none', lg: 'block' }} mb={{ base: 16, xl: 24 }}>
                <Box position="relative">
                    <Flex justify="space-between" alignItems="start" gap={{ base: 4, xl: 6 }}>
                        {sellingSteps.map((step, index) => (
                            <StepCard
                                key={step.id}
                                id={step.id}
                                icon={step.icon}
                                title={step.title}
                                description={step.description}
                                index={index}
                                isVisible={isVisible}
                                showArrow={index < sellingSteps.length - 1}
                            />
                        ))}
                    </Flex>
                </Box>
            </Box>

            {/* Mobile & Tablet Flow */}
            <VStack spacing={{ base: 6, sm: 8, md: 12 }} display={{ base: 'flex', lg: 'none' }}>
                {sellingSteps.map((step, index) => (
                    <StepCard
                        key={step.id}
                        id={step.id}
                        icon={step.icon}
                        title={step.title}
                        description={step.description}
                        index={index}
                        isVisible={isVisible}
                        showArrow={index < sellingSteps.length - 1}
                    />
                ))}
            </VStack>
        </Box>
    );
});

HowSellingWorksSection.displayName = 'HowSellingWorksSection';

export default HowSellingWorksSection;