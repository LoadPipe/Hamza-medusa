import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Icon,
  Flex,
} from '@chakra-ui/react';
import {
  Search,
  FileText,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';

interface HowHamzaWorksProps {
  selectedLanguage: string;
}

interface StepCardProps {
  step: {
    id: number;
    title: string;
    description: string;
    icon: React.ElementType;
  };
  index: number;
  isVisible: boolean;
  showArrow?: boolean;
}

const workflowSteps = [
  {
    id: 1,
    title: "Browse & Select",
    description: "Discover products from verified sellers worldwide",
    icon: Search,
  },
  {
    id: 2,
    title: "Smart Contract Creation",
    description: "Secure escrow automatically created for your transaction",
    icon: FileText,
  },
  {
    id: 3,
    title: "Secure Payment",
    description: "Pay with your preferred cryptocurrency",
    icon: CreditCard,
  },
  {
    id: 4,
    title: "Order Processing",
    description: "Seller prepares and ships your order",
    icon: Package,
  },
  {
    id: 5,
    title: "Delivery & Confirmation",
    description: "Receive your order and confirm satisfaction",
    icon: Truck,
  },
  {
    id: 6,
    title: "Automatic Settlement",
    description: "Smart contract releases payment to seller",
    icon: CheckCircle,
  },
];

const StepCard = memo(({ step, index, isVisible, showArrow = false }: StepCardProps) => {
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [isContentHovered, setIsContentHovered] = useState(false);

  const handleIconMouseEnter = useCallback(() => setIsIconHovered(true), []);
  const handleIconMouseLeave = useCallback(() => setIsIconHovered(false), []);
  const handleContentMouseEnter = useCallback(() => setIsContentHovered(true), []);
  const handleContentMouseLeave = useCallback(() => setIsContentHovered(false), []);

  return (
    <>
      {/* Desktop Layout */}
      <Flex direction="column" align="center" w="100%" position="relative" display={{ base: 'none', lg: 'flex' }}>
        <VStack
          spacing={8}
          opacity={isVisible ? 1 : 0}
          transform={isVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)'}
          transition={`all 0.6s ease-out ${0.3 + (index * 0.15)}s`}
        >
          {/* Step Icon with proper spacing and alignment */}
          <Box position="relative" >
            <Box
              bg={isIconHovered
                ? "linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.4))"
                : "rgba(34, 197, 94, 0.2)"
              }
              borderRadius="2xl"
              w={24}
              h={24}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              onMouseEnter={handleIconMouseEnter}
              onMouseLeave={handleIconMouseLeave}
              cursor="pointer"
              transform={isIconHovered ? "scale(1.1)" : "scale(1)"}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                bg: "linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.4))",
              }}
            >
              <Icon as={step.icon} w={12} h={12} color="green.400" />
            </Box>
          </Box>

          {/* Arrow between steps - Fixed positioning */}
          {showArrow && (
            <Box
              position="absolute"
              top={12}
              right={-3}
              transform="translateY(-50%)"
              opacity={isVisible ? 1 : 0}
              transition={`all 0.5s ease ${0.5 + (index * 0.1)}s`}
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
                      transform: 'translateX(8px)',
                    },
                  },
                }}
              />
            </Box>
          )}

          {/* Step Content with typography hierarchy and proper alignment */}
          <VStack
            spacing={4}
            textAlign="center"
            w="100%"
            onMouseEnter={handleContentMouseEnter}
            onMouseLeave={handleContentMouseLeave}
            cursor="pointer"
            transform={isContentHovered ? "translateY(-8px)" : "translateY(0)"}
            transition="all 0.3s cubic-bezier(0.3, 0, 0.2, 1)"
          >
            {/* Step number with proper styling */}
            <Text
              color="green.400"
              fontSize="sm"
              fontWeight="500"
              letterSpacing="0.1em"
              textTransform="uppercase"
            >
              Step {step.id}
            </Text>

            {/* Step title with proper weight and spacing */}
            <Text
              color="white"
              fontWeight="500"
              fontSize="lg"
              lineHeight="tight"
              letterSpacing="wide"
              px={2}
            >
              {step.title}
            </Text>

            {/* Visual separator */}
            <Box w={8} h="1px" bg="gray.700" mx="auto" />

            {/* Description with proper line spacing and alignment */}
            <Text
              color="gray.400"
              fontSize="sm"
              lineHeight="relaxed"
              letterSpacing="wide"
              px={2}
            >
              {step.description}
            </Text>
          </VStack>
        </VStack>
      </Flex>

      {/* Mobile Layout */}
      <VStack spacing={{ base: 6, sm: 8 }} w="100%" position="relative" display={{ base: 'flex', lg: 'none' }}>
        <HStack
          spacing={{ base: 4, sm: 6 }}
          w="100%"
          align="flex-start"
          opacity={isVisible ? 1 : 0}
          transform={isVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)'}
          transition={`all 0.6s ease-out ${0.3 + (index * 0.15)}s`}
        >
          {/* Step Icon - Mobile-optimized */}
          <Box
            position="relative"
            bg="rgba(34, 197, 94, 0.2)"
            borderRadius={{ base: 'xl', sm: '2xl' }}
            w={{ base: 16, sm: 18 }}
            h={{ base: 16, sm: 18 }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            _hover={{
              bg: "linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.4))",
              transform: "scale(1.1)",
            }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <Icon
              as={step.icon}
              w={{ base: 8, sm: 9 }}
              h={{ base: 8, sm: 9 }}
              color="green.400"
            />
          </Box>

          {/* Step Content - Mobile-optimized */}
          <VStack
            spacing={{ base: 2, sm: 4 }}
            align="flex-start"
            flex={1}
            pt={{ base: 1, sm: 2 }}
            _hover={{
              transform: "translateX(8px)",
            }}
            transition="all 0.3s cubic-bezier(0.3, 0, 0.2, 1)"
          >
            {/* Step number */}
            <Text
              color="green.400"
              fontSize={{ base: 'xs', sm: 'sm' }}
              fontWeight="500"
              letterSpacing="0.1em"
              textTransform="uppercase"
            >
              Step {step.id}
            </Text>

            {/* Step title */}
            <Text
              color="white"
              fontWeight="500"
              fontSize={{ base: 'lg', sm: 'xl' }}
              lineHeight="tight"
              letterSpacing="wide"
            >
              {step.title}
            </Text>

            {/* Visual separator */}
            <Box w={{ base: 8, sm: 12 }} h="1px" bg="gray.700" />

            {/* Description */}
            <Text
              color="gray.400"
              fontSize={{ base: 'sm', sm: 'base' }}
              lineHeight="relaxed"
              letterSpacing="wide"
              pr={2}
            >
              {step.description}
            </Text>
          </VStack>
        </HStack>

        {/* Arrow between steps - Mobile-optimized */}
        {showArrow && (
          <Flex
            justify="center"
            mt={{ base: 6, sm: 8 }}
            ml={{ base: 8, sm: 10 }}
            opacity={isVisible ? 1 : 0}
            transition={`all 0.5s ease ${0.3 + (index * 0.1)}s`}
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
                    transform: 'translateY(8px)',
                  },
                },
              }}
            />
          </Flex>
        )}
      </VStack>
    </>
  );
});

StepCard.displayName = 'StepCard';

const HowHamzaWorks = memo(({ selectedLanguage }: HowHamzaWorksProps) => {
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
      as="section"
      id="how-it-works"
      maxW="1200px"
      mx="auto"
      px={4}
      position="relative"
    >
      {/* Typography Hierarchy - Section Header with Green Theme */}
      <VStack
        spacing={6}
        textAlign="center"
        mb={{ base: 16, sm: 20, lg: 32 }}
        opacity={isVisible ? 1 : 0}
        transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
        transition="all 0.8s ease-out"
      >
        {/* Overline with proper tracking */}
        <Text
          color="gray.500"
          fontSize={{ base: 'xs', sm: 'sm' }}
          fontWeight="300"
          letterSpacing="0.2em"
          textTransform="uppercase"
          mb={{ base: 4, sm: 6 }}
        >
          Process Overview
        </Text>

        {/* Primary heading with mobile-optimized scale */}
        <Text
          fontSize={{ base: '3xl', sm: '4xl', lg: '5xl', xl: '6xl' }}
          fontWeight="300"
          color="white"
          mb={{ base: 6, sm: 8 }}
          letterSpacing="tight"
          lineHeight="1.1"
          px={2}
        >
          How <Text as="span" color="green.400" fontWeight="500">Hamza</Text> Works
        </Text>

        {/* Subtitle with mobile-optimized text size */}
        <Box maxW="3xl" mx="auto" px={2}>
          <Text
            fontSize={{ base: 'lg', sm: 'xl', lg: '2xl' }}
            fontWeight="300"
            lineHeight="relaxed"
            color="gray.300"
            letterSpacing="wide"
          >
            Experience seamless, secure, and transparent e-commerce through our innovative blockchain-powered platform.
          </Text>
        </Box>

        {/* Visual separator */}
        <Box
          w={{ base: 16, sm: 24 }}
          h="1px"
          bgGradient="linear(to-r, transparent, green.400, transparent)"
          mx="auto"
          mt={{ base: 6, sm: 8 }}
        />
      </VStack>

      {/* Desktop Flow - Hidden on mobile */}
      <Box display={{ base: 'none', lg: 'block' }} mb={24}>
        <Box position="relative">
          <SimpleGrid columns={6} spacing={6}>
            {workflowSteps.map((step, index) => (
              <StepCard
                key={step.id}
                step={step}
                index={index}
                isVisible={isVisible}
                showArrow={index < workflowSteps.length - 1}
              />
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* Mobile & Tablet Flow - Enhanced for mobile */}
      <VStack spacing={{ base: 8, sm: 12 }} display={{ base: 'flex', lg: 'none' }}>
        {workflowSteps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            index={index}
            isVisible={isVisible}
            showArrow={index < workflowSteps.length - 1}
          />
        ))}
      </VStack>
    </Box>
  );
});

HowHamzaWorks.displayName = 'HowHamzaWorks';

export default HowHamzaWorks;