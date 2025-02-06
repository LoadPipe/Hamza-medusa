import { Flex, Skeleton, SkeletonText } from '@chakra-ui/react';

const SkeletonOrderSummary = () => {
    return (
        <Flex
            flexDir={'column'}
            p={{ base: '16px', md: '40px' }}
            height="400px"
            alignSelf="flex-start"
            maxW={{ base: '100%', md: '401px' }}
            width={'100vw'}
            backgroundColor={'#121212'}
            borderRadius={'16px'}
        >
            {/* Skeleton for Summary Heading */}
            <SkeletonText
                noOfLines={1}
                width="100px"
                startColor="gray.300"
                endColor="gray.600"
            />

            {/* Skeleton for Divider */}
            <Skeleton
                height="1px"
                width="100%"
                mt="24px"
                mb="24px"
                startColor="gray.300"
                endColor="gray.600"
            />
            {/* Skeleton for CartTotals */}
            <Flex flexDirection={'column'} color="white" gap={2}>
                <Skeleton
                    height="14px"
                    mb="8px"
                    width="40%"
                    startColor="gray.300"
                    endColor="gray.600"
                />
                <Skeleton
                    height="14px"
                    mb="8px"
                    width="60%"
                    startColor="gray.300"
                    endColor="gray.600"
                />
                <Skeleton
                    height="14px"
                    mb="8px"
                    width="50%"
                    startColor="gray.300"
                    endColor="gray.600"
                />
            </Flex>

            {/* Skeleton for Divider */}
            <Skeleton
                height="1px"
                width="100%"
                mt="16px"
                mb="16px"
                startColor="gray.300"
                endColor="gray.600"
            />

            <Skeleton
                height="20px"
                mt="8px"
                mb="24px"
                width="100%"
                startColor="gray.300"
                endColor="gray.600"
            />

            {/* Skeleton for Discount Code */}
            <Skeleton
                height="40px"
                mt="auto"
                borderRadius="md"
                startColor="gray.300"
                endColor="gray.600"
            />

            {/* Skeleton for Button */}
            <Skeleton
                height="52px"
                mt="2rem"
                borderRadius="full"
                width="100%"
                startColor="gray.300"
                endColor="gray.600"
            />
        </Flex>
    );
};

export default SkeletonOrderSummary;
