import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    HStack,
    SimpleGrid,
    Icon,
    List,
    ListItem,
} from '@chakra-ui/react';
import {
    Shield,
    AlertTriangle,
    ShoppingCart,
    Package,
    CheckCircle,
    DollarSign,
    ArrowRight,
    ArrowDown,
} from 'lucide-react';

interface EscrowExplanationProps {
    selectedLanguage: string;
}

interface EscrowStepProps {
    step: {
        id: number;
        title: string;
        description: string;
        icon: React.ElementType;
    };
    index: number;
    isVisible: boolean;
    isLast: boolean;
}

interface FeatureListProps {
    title: string;
    features: string[];
    icon: React.ElementType;
    colorScheme: string;
    isVisible: boolean;
    delay: number;
}

const escrowSteps = [
    {
        id: 1,
        title: 'Order Placed',
        description: 'Buyer places order and funds are locked in smart contract',
        icon: ShoppingCart,
    },
    {
        id: 2,
        title: 'Seller Ships',
        description: 'Seller confirms shipment and provides tracking',
        icon: Package,
    },
    {
        id: 3,
        title: 'Buyer Receives',
        description: 'Buyer confirms receipt and quality of product',
        icon: CheckCircle,
    },
    {
        id: 4,
        title: 'Funds Released',
        description: 'Smart contract automatically releases payment to seller',
        icon: DollarSign,
    },
];

const EscrowStepCard = memo(({ step, index, isVisible, isLast }: EscrowStepProps) => {
    return (
        <VStack spacing={0} align="center" h="400px">
            <Box
                w={{ base: 16, sm: 20, lg: 28 }}
                h={{ base: 16, sm: 20, lg: 28 }}
                borderRadius={{ base: 'xl', lg: '2xl' }}
                bg="rgba(168, 85, 247, 0.2)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={{ base: 6, lg: 8 }}
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)'}
                transition={`all 0.6s ease ${0.1 + (index * 0.1)}s`}
                _hover={{
                    transform: "scale(1.1)",
                    bg: "rgba(168, 85, 247, 0.3)",
                    transition: "all 0.15s ease"
                }}
                cursor="pointer"
            >
                <Icon as={step.icon} w={{ base: 8, sm: 10, lg: 14 }} h={{ base: 8, sm: 10, lg: 14 }} color="purple.400" />
            </Box>

            <VStack spacing={4} textAlign="center" maxW="44" flex={1} justify="flex-start">
                <Text
                    color="purple.400"
                    fontSize="sm"
                    fontWeight="500"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    fontFamily="Arial, Helvetica, sans-serif"
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(10px)'}
                    transition={`all 0.5s ease ${0.2 + (index * 0.1)}s`}
                >
                    Step {step.id}
                </Text>

                <Text
                    fontWeight="500"
                    fontSize="lg"
                    color="white"
                    lineHeight="tight"
                    letterSpacing="wide"
                    fontFamily="Arial, Helvetica, sans-serif"
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(10px)'}
                    transition={`all 0.5s ease ${0.3 + (index * 0.1)}s`}
                    whiteSpace="nowrap"
                >
                    {step.title}
                </Text>

                <Box w={8} h="1px" bg="gray.700" opacity={isVisible ? 1 : 0} transition={`all 0.5s ease ${0.4 + (index * 0.1)}s`} />

                <Box minH="80px" display="flex" alignItems="flex-start">
                    <Text
                        fontSize="sm"
                        color="gray.400"
                        lineHeight="relaxed"
                        letterSpacing="wide"
                        fontFamily="Arial, Helvetica, sans-serif"
                        opacity={isVisible ? 1 : 0}
                        transform={isVisible ? 'translateY(0)' : 'translateY(10px)'}
                        transition={`all 0.5s ease ${0.5 + (index * 0.1)}s`}
                        textAlign="center"
                    >
                        {step.description}
                    </Text>
                </Box>
            </VStack>
        </VStack>
    );
});

EscrowStepCard.displayName = 'EscrowStepCard';

const MobileStepCard = memo(({ step, index, isVisible, isLast }: EscrowStepProps) => {
    return (
        <VStack spacing={0}>
            <HStack
                spacing={{ base: 4, sm: 6 }}
                p={{ base: 6, sm: 8 }}
                borderRadius={{ base: '2xl', sm: '3xl' }}
                bg="rgba(168, 85, 247, 0.05)"
                border="1px solid rgba(168, 85, 247, 0.2)"
                w="100%"
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)'}
                transition={`all 0.6s ease ${0.1 + (index * 0.1)}s`}
                _hover={{
                    transform: "scale(1.02)",
                    bg: "rgba(168, 85, 247, 0.08)",
                    transition: "all 0.15s ease"
                }}
                cursor="pointer"
            >
                <Box
                    w={{ base: 16, sm: 20 }}
                    h={{ base: 16, sm: 20 }}
                    borderRadius={{ base: 'xl', sm: '2xl' }}
                    bg="rgba(168, 85, 247, 0.2)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    _hover={{
                        transform: "scale(1.1)",
                        transition: "transform 0.15s ease"
                    }}
                >
                    <Icon as={step.icon} w={{ base: 8, sm: 10 }} h={{ base: 8, sm: 10 }} color="purple.400" />
                </Box>

                <VStack spacing={{ base: 1, sm: 2 }} align="start" flex={1}>
                    <Text
                        color="purple.400"
                        fontSize={{ base: 'xs', sm: 'sm' }}
                        fontWeight="500"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        fontFamily="Arial, Helvetica, sans-serif"
                    >
                        Step {step.id}
                    </Text>

                    <Text
                        fontWeight="500"
                        fontSize={{ base: 'lg', sm: 'xl' }}
                        color="white"
                        lineHeight="tight"
                        letterSpacing="wide"
                        fontFamily="Arial, Helvetica, sans-serif"
                    >
                        {step.title}
                    </Text>
                    <Box w={{ base: 8, sm: 12 }} h="1px" bg="gray.700" />
                    <Text
                        fontSize={{ base: 'sm', sm: 'md' }}
                        color="gray.400"
                        lineHeight="relaxed"
                        letterSpacing="wide"
                        fontFamily="Arial, Helvetica, sans-serif"
                        pr={2}
                    >
                        {step.description}
                    </Text>
                </VStack>
            </HStack>

            {!isLast && (
                <Box
                    display="flex"
                    justifyContent="center"
                    my={{ base: 4, sm: 6 }}
                    opacity={isVisible ? 0.6 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(-10px)'}
                    transition={`all 0.5s ease ${0.2 + (index * 0.1)}s`}
                >
                    <Icon
                        as={ArrowDown}
                        w={{ base: 5, sm: 6 }}
                        h={{ base: 5, sm: 6 }}
                        color="purple.400"
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
    );
});

MobileStepCard.displayName = 'MobileStepCard';

const FeatureList = memo(({ title, features, icon, colorScheme, isVisible, delay }: FeatureListProps) => {
    const iconColor = colorScheme === 'purple' ? 'purple.400' : 'green.400';

    return (
        <VStack
            spacing={{ base: 6, sm: 8 }}
            align="start"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
            transition={`all 0.6s ease ${delay}s`}
        >
            <VStack spacing={2} align="start">
                <Text
                    fontSize={{ base: 'lg', sm: 'xl', lg: '2xl' }}
                    fontWeight="500"
                    color="white"
                    letterSpacing="wide"
                    fontFamily="Arial, Helvetica, sans-serif"
                >
                    {title}
                </Text>
                <Box w={{ base: 8, sm: 12 }} h="1px" bg={iconColor} />
            </VStack>

            <List spacing={{ base: 4, sm: 6 }}>
                {features.map((feature, index) => (
                    <ListItem
                        key={index}
                        display="flex"
                        alignItems="start"
                        opacity={isVisible ? 1 : 0}
                        transform={isVisible ? 'translateX(0)' : 'translateX(-20px)'}
                        transition={`all 0.5s ease ${delay + 0.05 + (index * 0.05)}s`}
                        _hover={{
                            transform: "translateX(8px)",
                            transition: "transform 0.15s ease"
                        }}
                        cursor="pointer"
                    >
                        <Icon
                            as={icon}
                            w={{ base: 5, sm: 6 }}
                            h={{ base: 5, sm: 6 }}
                            color={iconColor}
                            mt={1}
                            mr={{ base: 3, sm: 4 }}
                            flexShrink={0}
                            _hover={{
                                transform: "scale(1.2) rotate(360deg)",
                                transition: "transform 0.15s ease"
                            }}
                        />
                        <Text
                            color="white"
                            fontSize={{ base: 'sm', sm: 'md', lg: 'lg' }}
                            fontWeight="300"
                            lineHeight="relaxed"
                            letterSpacing="wide"
                            fontFamily="Arial, Helvetica, sans-serif"
                        >
                            {feature}
                        </Text>
                    </ListItem>
                ))}
            </List>
        </VStack>
    );
});

FeatureList.displayName = 'FeatureList';

const EscrowExplanation = memo(({ selectedLanguage }: EscrowExplanationProps) => {
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

    const securityFeatures = [
        'Multi-signature wallet protection',
        'Automated dispute resolution',
        'Immutable transaction records',
        'Time-locked fund release',
    ];

    const disputeFeatures = [
        'Decentralized arbitration network',
        'Evidence-based resolution system',
        'Fair fee redistribution',
        'Community-driven governance',
    ];

    return (
        <Box
            ref={sectionRef}
            id="escrow"
            maxW="1200px"
            mx="auto"
            px={4}
            position="relative"
            zIndex={1}
        >
            {/* Typography Hierarchy - Section Header with Purple Theme */}
            <Box
                textAlign="center"
                mb={{ base: 16, sm: 20, lg: 32 }}
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                transition="all 0.6s ease 0.2s"
            >
                {/* Overline */}
                <Text
                    color="gray.500"
                    fontSize={{ base: 'xs', sm: 'sm' }}
                    fontWeight="300"
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    mb={{ base: 4, sm: 6 }}
                    fontFamily="Arial, Helvetica, sans-serif"
                >
                    Security Framework
                </Text>

                {/* Primary heading */}
                <Text
                    fontSize={{ base: '2xl', sm: '3xl', lg: '5xl', xl: '6xl' }}
                    fontWeight="300"
                    color="white"
                    mb={{ base: 6, sm: 8 }}
                    letterSpacing="tight"
                    lineHeight="1.1"
                    fontFamily="Arial, Helvetica, sans-serif"
                    px={2}
                >
                    What is{' '}
                    <Text as="span" color="purple.400" fontWeight="500">
                        Escrow
                    </Text>
                    ?
                </Text>

                {/* Subtitle */}
                <Box maxW="4xl" mx="auto" px={2}>
                    <Text
                        fontSize={{ base: 'md', sm: 'lg', lg: '2xl' }}
                        fontWeight="300"
                        lineHeight="relaxed"
                        color="gray.300"
                        letterSpacing="wide"
                        fontFamily="Arial, Helvetica, sans-serif"
                    >
                        Escrow is a secure financial arrangement where a third
                        party holds and regulates payment of funds required for
                        two parties involved in a given transaction.
                    </Text>
                </Box>

                {/* Visual separator */}
                <Box
                    w={{ base: "5rem", sm: "6rem" }}
                    h="1px"
                    bgGradient="linear(to-r, transparent, #c084fc, transparent)"
                    mx="auto"
                    mb={{ base: 12, md: 20 }}
                    mt={{ base: 4, sm: 6 }}
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'scaleX(1)' : 'scaleX(0)'}
                    transition="all 0.6s ease 0.4s"
                />
            </Box>

            {/* Process Flow Section */}
            <Box mb={{ base: 6, sm: 8, lg: 16 }}>
                <Box
                    textAlign="center"
                    mb={{ base: 12, sm: 16 }}
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                    transition="all 0.6s ease 0.2s"
                >
                    <Text
                        fontSize={{ base: 'xl', sm: '2xl', lg: '3xl' }}
                        fontWeight="300"
                        color="white"
                        mb={{ base: 3, sm: 4 }}
                        letterSpacing="wide"
                        fontFamily="Arial, Helvetica, sans-serif"
                    >
                        How Escrow Works
                    </Text>
                    <Text
                        color="gray.400"
                        fontSize={{ base: 'sm', sm: 'md' }}
                        fontWeight="300"
                        letterSpacing="wide"
                        fontFamily="Arial, Helvetica, sans-serif"
                    >
                        Four simple steps to secure transactions
                    </Text>
                </Box>

                {/* Desktop Flow */}
                <Box display={{ base: 'none', lg: 'block' }} mb={8}>
                    <HStack spacing={0} justify="space-between" maxW="5xl" mx="auto">
                        {escrowSteps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <EscrowStepCard
                                    step={step}
                                    index={index}
                                    isVisible={isVisible}
                                    isLast={index === escrowSteps.length - 1}
                                />
                                {index < escrowSteps.length - 1 && (
                                    <Box
                                        display="flex"
                                        alignItems="flex-start"
                                        justifyContent="center"
                                        w={16}
                                        h={20}
                                        mt={-8}
                                        opacity={isVisible ? 0.6 : 0}
                                        transition={`all 0.5s ease ${0.3 + (index * 0.1)}s`}
                                    >
                                        <Icon
                                            as={ArrowRight}
                                            w={6}
                                            h={6}
                                            color="purple.400"
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
                            </React.Fragment>
                        ))}
                    </HStack>
                </Box>

                {/* Mobile & Tablet Flow */}
                <VStack spacing={{ base: 6, sm: 8 }} mb={{ base: 12, sm: 16 }} display={{ lg: 'none' }}>
                    {escrowSteps.map((step, index) => (
                        <MobileStepCard
                            key={step.id}
                            step={step}
                            index={index}
                            isVisible={isVisible}
                            isLast={index === escrowSteps.length - 1}
                        />
                    ))}
                </VStack>
            </Box>

            {/* Smart Contract Security Section */}
            <Box
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                transition="all 0.6s ease 0.4s"
            >
                <Box
                    bg="rgba(0, 0, 0, 0.5)"
                    border="1px solid rgba(168, 85, 247, 0.3)"
                    borderRadius={{ base: '2xl', sm: '3xl' }}
                    p={{ base: 8, sm: 10, lg: 16 }}
                    _hover={{
                        borderColor: "rgba(168, 85, 247, 0.5)",
                        transition: "border-color 0.15s ease"
                    }}
                >
                    {/* Section header */}
                    <Box
                        textAlign="center"
                        mb={{ base: 12, sm: 16 }}
                        opacity={isVisible ? 1 : 0}
                        transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                        transition="all 0.6s ease 0.6s"
                    >
                        <Box display="flex" alignItems="center" justifyContent="center" mb={{ base: 4, sm: 6 }}>
                            <Icon
                                as={Shield}
                                w={{ base: 10, sm: 12 }}
                                h={{ base: 10, sm: 12 }}
                                color="purple.400"
                                _hover={{
                                    transform: "rotate(360deg)",
                                    transition: "transform 0.3s ease"
                                }}
                                cursor="pointer"
                            />
                        </Box>

                        <Text
                            fontSize={{ base: 'xl', sm: '2xl', lg: '3xl' }}
                            fontWeight="300"
                            color="white"
                            mb={{ base: 4, sm: 6 }}
                            letterSpacing="wide"
                            fontFamily="Arial, Helvetica, sans-serif"
                        >
                            Smart Contract Security
                        </Text>

                        <Box maxW="3xl" mx="auto" px={2}>
                            <Text
                                color="white"
                                fontSize={{ base: 'md', sm: 'lg', lg: 'xl' }}
                                fontWeight="300"
                                lineHeight="relaxed"
                                letterSpacing="wide"
                                fontFamily="Arial, Helvetica, sans-serif"
                            >
                                Our escrow system is powered by audited
                                smart contracts that ensure complete
                                transparency and eliminate the need for
                                trust between parties.
                            </Text>
                        </Box>
                        <Box w="4rem" h="1px" bg="rgb(192 132 252)" mx="auto" mt={6} />
                    </Box>


                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 8, sm: 12, lg: 16 }}>
                        <FeatureList
                            title="Security Features"
                            features={securityFeatures}
                            icon={CheckCircle}
                            colorScheme="purple"
                            isVisible={isVisible}
                            delay={0.6}
                        />

                        <FeatureList
                            title="Dispute Resolution"
                            features={disputeFeatures}
                            icon={AlertTriangle}
                            colorScheme="green"
                            isVisible={isVisible}
                            delay={0.7}
                        />
                    </SimpleGrid>
                </Box>
            </Box>
        </Box>
    );
});

EscrowExplanation.displayName = 'EscrowExplanation';

export default EscrowExplanation;