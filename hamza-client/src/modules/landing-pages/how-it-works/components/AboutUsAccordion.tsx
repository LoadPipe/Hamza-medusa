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
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react';
import { Users, Target, Lightbulb, Rocket } from 'lucide-react';

interface AboutUsAccordionProps {
    selectedLanguage: string;
}

interface AccordionItemProps {
    value: string;
    trigger: string;
    icon: React.ElementType;
    content: string;
    index: number;
    isVisible: boolean;
}

const accordionItems = [
    {
        value: 'mission',
        trigger: 'Our Mission',
        icon: Target,
        content:
            'To democratize global commerce by creating a decentralized marketplace that empowers individuals and businesses to trade directly, securely, and transparently without traditional intermediaries.',
    },
    {
        value: 'vision',
        trigger: 'Our Vision',
        icon: Lightbulb,
        content:
            "To become the world's leading decentralized e-commerce platform, fostering a global economy where trust is built through technology, not institutions, and where every participant has equal access to opportunities.",
    },
    {
        value: 'team',
        trigger: 'Our Team',
        icon: Users,
        content:
            'We are a diverse team of blockchain developers, e-commerce experts, and visionaries united by our passion for decentralization. Our combined expertise spans smart contract development, user experience design, and marketplace operations.',
    },
    {
        value: 'technology',
        trigger: 'Our Technology',
        icon: Rocket,
        content:
            'Built on cutting-edge blockchain technology, Hamza leverages smart contracts, IPFS for decentralized storage, and advanced cryptographic protocols to ensure security, transparency, and scalability for global commerce.',
    },
];

const CustomAccordionItem = memo(({ value, trigger, icon, content, index, isVisible }: AccordionItemProps) => {
    return (
        <AccordionItem
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="3xl"
            bg="rgba(0, 0, 0, 0.5)"
            backdropFilter="blur(10px)"
            px={10}
            py={4}
            mb={8}
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
            transition={`all 0.6s ease ${0.3 + (index * 0.1)}s`}
            _hover={{
                borderColor: "rgba(34, 197, 94, 0.3)"
            }}
        >
            <AccordionButton
                py={10}
                _hover={{ bg: 'transparent' }}
                _focus={{ boxShadow: 'none' }}
            >
                <HStack spacing={6} flex="1" textAlign="left">
                    <Box
                        w={16}
                        h={16}
                        bg="rgba(34, 197, 94, 0.2)"
                        borderRadius="2xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        transition="all 0.3s ease"
                        _hover={{
                            bg: "rgba(34, 197, 94, 0.3)",
                            transform: "scale(1.1)"
                        }}
                    >
                        <Icon as={icon} w={8} h={8} color="green.400" />
                    </Box>
                    <Text
                        fontSize={{ base: 'xl', lg: '2xl' }}
                        color="white"
                        fontWeight="300"
                        fontFamily="Arial, Helvetica, sans-serif"
                        letterSpacing="wide"
                        _groupHover={{ color: "green.400" }}
                        transition="color 0.3s ease"
                    >
                        {trigger}
                    </Text>
                </HStack>
                <AccordionIcon color="green.400" />
            </AccordionButton>
            <AccordionPanel pb={10}>
                <Box pl={22}>
                    <Text
                        color="white"
                        lineHeight="relaxed"
                        fontSize={{ base: 'md', lg: 'lg' }}
                        fontWeight="300"
                        fontFamily="Arial, Helvetica, sans-serif"
                        letterSpacing="wide"
                    >
                        {content}
                    </Text>
                </Box>
            </AccordionPanel>
        </AccordionItem>
    );
});

CustomAccordionItem.displayName = 'CustomAccordionItem';

const AboutUsAccordion = memo(({ selectedLanguage }: AboutUsAccordionProps) => {
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
            id="about-us"
            maxW="1200px"
            mx="auto"
            px={4}
            position="relative"
            zIndex={1}
        >
            {/* Typography Hierarchy - Section Header with Green Theme */}
            <Box
                textAlign="center"
                mb={{ base: 24, lg: 32 }}
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                transition="all 0.8s ease"
            >
                {/* Overline */}
                <Text
                    color="gray.500"
                    fontSize="sm"
                    fontWeight="300"
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    mb={6}
                    fontFamily="Arial, Helvetica, sans-serif"
                >
                    Our Foundation
                </Text>

                {/* Primary heading */}
                <Text
                    fontSize={{ base: '4xl', lg: '5xl', xl: '6xl' }}
                    fontWeight="300"
                    color="white"
                    mb={8}
                    letterSpacing="tight"
                    lineHeight="1.1"
                    fontFamily="Arial, Helvetica, sans-serif"
                >
                    Why{' '}
                    <Text as="span" color="green.400" fontWeight="500">
                        Hamza
                    </Text>
                    ?
                </Text>

                {/* Subtitle */}
                <Box maxW="3xl" mx="auto">
                    <Text
                        fontSize={{ base: 'xl', lg: '2xl' }}
                        fontWeight="300"
                        lineHeight="relaxed"
                        color="gray.300"
                        letterSpacing="wide"
                        fontFamily="Arial, Helvetica, sans-serif"
                    >
                        Learn more about the team and vision behind Hamza's
                        revolutionary approach to decentralized commerce.
                    </Text>
                </Box>

                {/* Visual separator */}
                <Box
                    w={24}
                    h="1px"
                    bg="linear-gradient(to right, transparent, #4ade80, transparent)"
                    mx="auto"
                    mt={8}
                />
            </Box>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 20, lg: 24 }} alignItems="start">
                {/* Left Side - Accordions */}
                <Box>
                    <Accordion allowToggle>
                        {accordionItems.map((item, index) => (
                            <CustomAccordionItem
                                key={item.value}
                                value={item.value}
                                trigger={item.trigger}
                                icon={item.icon}
                                content={item.content}
                                index={index}
                                isVisible={isVisible}
                            />
                        ))}
                    </Accordion>
                </Box>

                {/* Right Side - About Text & Stats */}
                <Box
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateX(0)' : 'translateX(50px)'}
                    transition="all 0.8s ease 0.4s"
                >
                    <Box
                        bg="rgba(0, 0, 0, 0.5)"
                        border="1px solid rgba(34, 197, 94, 0.3)"
                        borderRadius="3xl"
                        p={{ base: 12, lg: 16 }}
                        _hover={{
                            borderColor: "rgba(34, 197, 94, 0.5)",
                            transform: "translateY(-8px)"
                        }}
                        transition="all 0.5s ease"
                    >
                        {/* Section header */}
                        <Box
                            mb={10}
                            opacity={isVisible ? 1 : 0}
                            transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                            transition="all 0.6s ease 0.6s"
                        >
                            <Text
                                fontSize={{ base: '2xl', lg: '3xl' }}
                                fontWeight="300"
                                color="white"
                                mb={4}
                                letterSpacing="wide"
                                fontFamily="Arial, Helvetica, sans-serif"
                            >
                                Why Hamza?
                            </Text>
                            <Box w={16} h="1px" bg="green.400" />
                        </Box>

                        {/* Content */}
                        <VStack spacing={8} align="start">
                            <Text
                                color="white"
                                lineHeight="1.7"
                                fontSize={{ base: 'md', lg: 'lg' }}
                                fontWeight="300"
                                letterSpacing="wide"
                                fontFamily="Arial, Helvetica, sans-serif"
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                                transition="all 0.6s ease 0.8s"
                            >
                                Traditional e-commerce platforms have
                                dominated the market for decades, taking
                                substantial fees and controlling every
                                aspect of online trade. We believe it's
                                time for a change.
                            </Text>
                            <Text
                                color="white"
                                lineHeight="1.7"
                                fontSize={{ base: 'md', lg: 'lg' }}
                                fontWeight="300"
                                letterSpacing="wide"
                                fontFamily="Arial, Helvetica, sans-serif"
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                                transition="all 0.6s ease 1.0s"
                            >
                                Hamza represents a paradigm shift
                                towards true peer-to-peer commerce,
                                where blockchain technology eliminates
                                the need for centralized intermediaries
                                while ensuring security and trust
                                through smart contracts.
                            </Text>
                            <Text
                                color="white"
                                lineHeight="1.7"
                                fontSize={{ base: 'md', lg: 'lg' }}
                                fontWeight="300"
                                letterSpacing="wide"
                                fontFamily="Arial, Helvetica, sans-serif"
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                                transition="all 0.6s ease 1.2s"
                            >
                                Our platform empowers both buyers and
                                sellers with lower fees, faster
                                settlements, and complete transparency
                                in every transaction.
                            </Text>
                        </VStack>
                    </Box>
                </Box>
            </SimpleGrid>
        </Box>
    );
});

AboutUsAccordion.displayName = 'AboutUsAccordion';

export default AboutUsAccordion;