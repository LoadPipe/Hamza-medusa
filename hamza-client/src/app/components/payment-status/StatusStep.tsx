'use client';

import { Box, VStack, HStack, Text, Icon, Spinner } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

interface StatusStepProps {
    step: {
        label: string;
        subLabel: string;
        status: string;
    };
    currentStatus: string;
    index: number;
    progress?: number;
    getStatusColor: (status: string) => string;
    endTimestamp: number;
    startTimestamp: number;
}

const formatTimeRemaining = (
    progress: number,
    endTimestamp: number,
    startTimestamp: number
) => {
    const timeRemaining = Math.floor(
        (((100 - progress) / 100) * (endTimestamp - startTimestamp)) / 1000
    );

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = Math.floor(timeRemaining % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const StatusStep = ({
    step,
    currentStatus,
    index,
    progress = 0,
    getStatusColor,
    endTimestamp,
    startTimestamp,
}: StatusStepProps) => {
    return (
        <Box flex={1}>
            <VStack spacing={2} align="start">
                {/* Status Line */}
                <Box position="relative" w="100%" h="10px">
                    {/* Background line (gray) */}
                    <Box
                        h="10px"
                        borderRadius="5px"
                        bg={
                            step.status === 'waiting'
                                ? 'gray.600'
                                : getStatusColor(step.status)
                        }
                        w="100%"
                        position={index === 0 ? 'relative' : 'absolute'}
                        left={0}
                    />

                    {/* Progress line (green) - only shown for waiting status */}
                    {step.status === 'waiting' && (
                        <Box
                            h="10px"
                            borderRadius="5px"
                            background={
                                progress === 100
                                    ? '#94D42A'
                                    : 'linear-gradient(to right, #94D42A, #FFFFFF)'
                            }
                            w={`${progress}%`}
                            position="absolute"
                            left={0}
                            top={0}
                        />
                    )}
                </Box>

                {/* Status Icon and Text */}
                <HStack spacing={2} align="flex-start">
                    {step.status === 'waiting' && progress < 100 ? (
                        <Spinner
                            color={getStatusColor(step.status)}
                            size="sm"
                            thickness="2px"
                            speed="0.8s"
                        />
                    ) : (
                        <Icon
                            as={CheckCircleIcon}
                            color={
                                step.status === currentStatus
                                    ? 'white'
                                    : getStatusColor(step.status)
                            }
                            boxSize={5}
                            bg="gray.900"
                        />
                    )}
                    <VStack spacing={1} align="start" gap={0}>
                        <Text
                            fontSize="sm"
                            color={
                                step.status === currentStatus
                                    ? 'white'
                                    : getStatusColor(step.status)
                            }
                            fontWeight="bold"
                        >
                            {step.label}
                        </Text>
                        {step.status === 'waiting' && (
                            <Text fontSize="sm" color="primary.green.900">
                                Time remaining:{' '}
                                {formatTimeRemaining(
                                    progress,
                                    endTimestamp,
                                    startTimestamp
                                )}
                            </Text>
                        )}
                        <Text fontSize="xs" color="gray.500">
                            {step.subLabel}
                        </Text>
                    </VStack>
                </HStack>
            </VStack>
        </Box>
    );
};

export default StatusStep;
