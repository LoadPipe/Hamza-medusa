import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
    Box,
    Container,
    VStack,
    Text,
    HStack,
    Button,
    Link,
} from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';

interface CallToActionProps {
    selectedLanguage: string;
}

interface FeatureBadgeProps {
    text: string;
    index: number;
    isVisible: boolean;
}

const features = [
    { text: 'No signup required' },
    { text: 'Start trading in seconds' },
    { text: 'Completely decentralized' },
];

const FeatureBadge = memo(({ text, index, isVisible }: FeatureBadgeProps) => {
    return (
        <Text
            fontSize={{ base: 'xs', sm: 'sm' }}
            color="gray.400"
            whiteSpace="nowrap"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
            transition={`all 0.6s ease ${1.8 + (index * 0.1)}s`}
        >
            {text}
        </Text>
    );
});

FeatureBadge.displayName = 'FeatureBadge';

const CallToAction = memo(({ selectedLanguage }: CallToActionProps) => {
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
            <Container maxW="900px" position="relative" zIndex={1}>
                <Box
                    bg="rgba(0, 0, 0, 0.8)"
                    backdropFilter="blur(10px)"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    borderRadius="3xl"
                    p={{ base: 8, sm: 12, lg: 20 }}
                    textAlign="center"
                    position="relative"
                    overflow="hidden"
                    opacity={isVisible ? 1 : 0}
                    transform={isVisible ? 'translateY(0)' : 'translateY(50px)'}
                    transition="all 0.8s ease 0.2s"
                >
                    <VStack spacing={{ base: 8, sm: 10, lg: 12 }}>
                        {/* Typography Hierarchy - Clean and Simple */}
                        <VStack
                            spacing={8}
                            opacity={isVisible ? 1 : 0}
                            transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                            transition="all 0.6s ease 0.4s"
                        >
                            <Text
                                fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
                                fontWeight="300"
                                fontFamily="Arial, Helvetica, sans-serif"
                                color="white"
                                lineHeight="tight"
                                letterSpacing="tight"
                            >
                                Start Trading{' '}
                                <Text as="span" bgGradient="linear(to-r, #4ade80, #a855f7)" bgClip="text">
                                    Decentralized
                                </Text>{' '}
                                Today
                            </Text>

                            <Text
                                fontSize={{ base: 'lg', sm: 'xl', lg: '2xl' }}
                                color="gray.300"
                                lineHeight="relaxed"
                                fontWeight="300"
                                fontFamily="Arial, Helvetica, sans-serif"
                                maxW="2xl"
                                mx="auto"
                                opacity={isVisible ? 1 : 0}
                                transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                                transition="all 0.6s ease 0.6s"
                            >
                                Join the world's first truly decentralized
                                marketplace. No middlemen, just direct peer-to-peer
                                commerce.
                            </Text>
                        </VStack>

                        {/* CTA Button - Simple and Clean */}
                        <Box
                            opacity={isVisible ? 1 : 0}
                            transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                            transition="all 0.6s ease 1.4s"
                        >
                            <Link href="http://hamza.market/" isExternal>
                                <Button
                                    size="lg"
                                    bg="linear-gradient(to right, #4ade80, #22c55e)"
                                    color="black"
                                    px={{ base: 8, sm: 10, lg: 12 }}
                                    py={{ base: 4, sm: 5, lg: 6 }}
                                    fontSize={{ base: 'lg', sm: 'xl' }}
                                    fontWeight="500"
                                    fontFamily="Arial, Helvetica, sans-serif"
                                    borderRadius="full"
                                    _hover={{
                                        bg: "linear-gradient(to right, #22c55e, #16a34a)",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)",
                                    }}
                                    _active={{
                                        transform: "translateY(0)",
                                    }}
                                    transition="all 0.3s ease"
                                    rightIcon={<ArrowRight size={24} />}
                                >
                                    Launch Marketplace
                                </Button>
                            </Link>
                        </Box>

                        {/* Simple Feature List */}
                        <HStack
                            spacing={{ base: 4, sm: 6, lg: 8 }}
                            flexDirection={{ base: 'column', sm: 'row' }}
                            align="center"
                            justify="center"
                        >
                            {features.map((feature, index) => (
                                <HStack key={feature.text} spacing={0}>
                                    <FeatureBadge
                                        text={feature.text}
                                        index={index}
                                        isVisible={isVisible}
                                    />
                                    {index < features.length - 1 && (
                                        <Box
                                            display={{ base: 'none', sm: 'block' }}
                                            w="1px"
                                            h={4}
                                            bg="gray.700"
                                            ml={{ sm: 6, lg: 8 }}
                                        />
                                    )}
                                </HStack>
                            ))}
                        </HStack>

                        {/* Bottom text */}
                        <Text
                            fontSize={{ base: 'sm', sm: 'md' }}
                            color="gray.400"
                            fontWeight="300"
                            fontFamily="Arial, Helvetica, sans-serif"
                            maxW="2xl"
                            mx="auto"
                            lineHeight="relaxed"
                            opacity={isVisible ? 1 : 0}
                            transform={isVisible ? 'translateY(0)' : 'translateY(20px)'}
                            transition="all 0.6s ease 2.2s"
                        >
                            Join thousands of traders who have already discovered the power of decentralized commerce. Your trading journey starts here.
                        </Text>
                    </VStack>
                </Box>
            </Container>
        </Box>
    );
});

CallToAction.displayName = 'CallToAction';

export default CallToAction;