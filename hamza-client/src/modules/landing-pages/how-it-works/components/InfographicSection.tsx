import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  HStack,
  Icon,
  Flex,
} from '@chakra-ui/react';
import {
  ShoppingCart,
  Lock,
  Package,
  CheckCircle,
  DollarSign,
  Gift,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';

interface InfographicSectionProps {
  selectedLanguage: string;
}

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
    icon: ShoppingCart,
    title: 'Buyer Adds to Cart',
    description: 'Customer selects products and proceeds to checkout',
  },
  {
    stepNumber: 'Step 2',
    icon: Lock,
    title: 'Escrow Created',
    description: 'Smart contract holds funds securely',
  },
  {
    stepNumber: 'Step 3',
    icon: Package,
    title: 'Seller Ships Product',
    description: 'Product is shipped to buyer',
  },
  {
    stepNumber: 'Step 4',
    icon: CheckCircle,
    title: 'Buyer Confirms Receipt',
    description: 'Buyer confirms product received',
  },
  {
    stepNumber: 'Step 5',
    icon: DollarSign,
    title: 'Funds Released',
    description: 'Payment released to seller',
  },
  {
    stepNumber: 'Step 6',
    icon: Gift,
    title: 'DECOM Rewards',
    description: 'Both parties earn DECOM tokens',
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
              w={24}
              h={24}
              borderRadius="2xl"
              bg={isIconHovered ? "#411E64" : "#281839"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
              zIndex={10}
              mx="auto"
              onMouseEnter={handleIconMouseEnter}
              onMouseLeave={handleIconMouseLeave}
              cursor="pointer"
              transform={isIconHovered ? "scale(1.15)" : "scale(1)"}
              transition="all 0.3s ease"
              _hover={{
                bg: "rgba(168, 85, 247, 0.3)",
              }}
            >
              <Icon
                as={icon}
                w={12}
                h={12}
                color="purple.400"
              />
            </Box>
          </Box>

          <VStack
            spacing={4}
            maxW="240px"
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
              color="purple.400"
              letterSpacing="0.1em"
              textTransform="uppercase"
              lineHeight="1.25rem"
            >
              {stepNumber}
            </Text>

            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight="600"
              color="white"
              lineHeight="1.3"
              letterSpacing="wide"
            >
              {title}
            </Text>

            <Box
              w="32px"
              h="1px"
              bg="gray.700"
              transition="background-color 0.3s ease"
            />

            <Text
              fontSize={{ base: 'sm', md: 'sm' }}
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
            h={24}
            mt={12}
            opacity={isVisible ? 0.6 : 0}
            transition={`all 0.6s ease ${1.4 + (index * 0.2)}s`}
          >
            <Icon
              as={ArrowRight}
              w={6}
              h={6}
              color="gray.600"
              sx={{
                animation: `slideArrowX 2.5s ease-in-out infinite`,
                '@keyframes slideArrowX': {
                  '0%, 100%': {
                    transform: 'translateX(0px)',
                  },
                  '50%': {
                    transform: 'translateX(10px)',
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
            w={{ base: 16, sm: 18 }}
            h={{ base: 16, sm: 18 }}
            borderRadius={{ base: 'xl', sm: '2xl' }}
            bg="rgba(168, 85, 247, 0.2)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            _hover={{
              bg: "rgba(168, 85, 247, 0.3)",
              transform: "scale(1.1)",
            }}
            transition="all 0.3s ease"
          >
            <Icon
              as={icon}
              w={{ base: 8, sm: 9 }}
              h={{ base: 8, sm: 9 }}
              color="purple.400"
            />
          </Box>

          <VStack
            spacing={{ base: 2, sm: 3 }}
            align="flex-start"
            flex={1}
            pt={{ base: 1, sm: 2 }}
            _hover={{
              transform: "translateX(8px)",
            }}
            transition="all 0.3s ease"
          >
            <Text
              fontSize={{ base: 'xs', sm: 'sm' }}
              fontWeight="500"
              fontFamily="Arial, Helvetica, sans-serif"
              color="purple.400"
              letterSpacing="0.1em"
              textTransform="uppercase"
            >
              {stepNumber}
            </Text>

            <Text
              fontSize={{ base: 'lg', sm: 'xl' }}
              fontWeight="600"
              color="white"
              lineHeight="1.3"
              letterSpacing="wide"
            >
              {title}
            </Text>

            <Box
              w={{ base: "32px", sm: "48px" }}
              h="1px"
              bg="gray.700"
            />

            <Text
              fontSize={{ base: 'sm', sm: 'base' }}
              fontFamily="Arial, Helvetica, sans-serif"
              letterSpacing="0.025em"
              color="gray.400"
              lineHeight="1.625"
              pr={2}
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
            mt={{ base: 6, sm: 8 }}
            opacity={isVisible ? 0.6 : 0}
            transition={`all 0.6s ease ${1.4 + (index * 0.2)}s`}
          >
            <Icon
              as={ArrowDown}
              w={{ base: 5, sm: 6 }}
              h={{ base: 5, sm: 6 }}
              color="gray.600"
              sx={{
                animation: `slideArrowY 2.5s ease-in-out infinite`,
                '@keyframes slideArrowY': {
                  '0%, 100%': {
                    transform: 'translateY(0px)',
                  },
                  '50%': {
                    transform: 'translateY(10px)',
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

const InfographicSection = memo(({ selectedLanguage }: InfographicSectionProps) => {
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
      id="infographic"
    >
      <Container maxW="7xl" position="relative" zIndex={1}>
        <VStack spacing={6}>
          {/* Section Header */}
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
              transition="all 0.8s ease 0.2s"
            >
              Transaction Journey
            </Text>

            <VStack spacing={4}>
              <Text
                fontSize={{ base: '2xl', sm: '3xl', lg: '5xl', xl: '6xl' }}
                fontWeight="300"
                fontFamily="Arial, Helvetica, sans-serif"
                letterSpacing="-0.025em"
                color="white"
                lineHeight="1.1"
                px={2}
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                transition="all 0.8s ease 0.4s"
              >
                Hamza{' '}
                <Text as="span" bgGradient="linear(to-r, #a855f7, #8b5cf6)" bgClip="text" fontWeight="500">
                  Transaction Flow
                </Text>
              </Text>

              <Text
                fontSize={{ base: 'base', sm: 'lg', lg: '2xl' }}
                fontFamily="Arial, Helvetica, sans-serif"
                fontWeight="300"
                letterSpacing="0.025em"
                color="gray.300"
                maxW="3xl"
                lineHeight="1.625"
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
                transition="all 0.8s ease 0.6s"
              >
                See how every transaction on Hamza is secured and automated through our smart contract system.
              </Text>
            </VStack>
          </VStack>

          {/* Visual separator */}
          <Box
            w={{ base: "4rem", sm: "6rem" }}
            h="1px"
            bgGradient="linear(to-r, transparent, #a855f7, transparent)"
            mx="auto"
            mb={{ base: 12, md: 20 }}
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'scaleX(1)' : 'scaleX(0)'}
            transition="all 0.8s ease 0.8s"
          />

          {/* Desktop View */}
          <Box display={{ base: 'none', lg: 'block' }} w="100%">
            <HStack spacing={0} justify="space-between" align="flex-start" maxW="6xl" mx="auto">
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
          <VStack spacing={{ base: 8, sm: 10 }} w="100%" display={{ base: 'flex', lg: 'none' }}>
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

InfographicSection.displayName = 'InfographicSection';

export default InfographicSection;