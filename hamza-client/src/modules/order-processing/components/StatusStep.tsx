'use client';

import { Box, VStack, HStack, Text, Icon, Spinner } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { StatusStepDisplayProps, StepDisplayState } from '../types';
import { getStepColors } from '../utils';
const StatusStep = ({
    step,
    index,
    progress = 0,
    displayState,
    timeRemaining,
    currentStatus,
}: StatusStepDisplayProps & { currentStatus: string }) => {
    const { lineColor, iconColor, textColor } = getStepColors(
        displayState,
        step.status,
        currentStatus
    );

    return (
        <Box flex={1}>
            <VStack spacing={2} align="start">
                {/* Status Line */}
                <Box position="relative" w="100%" h="10px">
                    {/* Background line */}
                    <Box
                        h="10px"
                        borderRadius="5px"
                        bg={lineColor}
                        w="100%"
                        position={index === 0 ? 'relative' : 'absolute'}
                        left={0}
                    />

                    {/* Progress line - only shown for active with timer */}
                    {displayState === StepDisplayState.ACTIVE_WITH_TIMER && (
                        <Box
                            h="10px"
                            borderRadius="5px"
                            background="linear-gradient(to right, #94D42A, #FFFFFF)"
                            w={`${progress}%`}
                            position="absolute"
                            left={0}
                            top={0}
                        />
                    )}
                </Box>

                {/* Status Icon and Text */}
                <HStack spacing={2} align="flex-start">
                    {displayState === StepDisplayState.ACTIVE_WITH_TIMER ? (
                        <Spinner
                            color={iconColor}
                            size="sm"
                            thickness="2px"
                            speed="0.8s"
                        />
                    ) : (
                        <Icon
                            as={CheckCircleIcon}
                            color={iconColor}
                            boxSize={5}
                            bg="gray.900"
                        />
                    )}
                    <VStack spacing={1} align="start" gap={0}>
                        <Text fontSize="sm" color={textColor} fontWeight="bold">
                            {step.status === 'waiting' &&
                            currentStatus === 'expired'
                                ? 'Expired'
                                : step.status === 'received' &&
                                    currentStatus === 'partial'
                                  ? 'Partial'
                                  : step.label}
                        </Text>
                        {displayState === StepDisplayState.ACTIVE_WITH_TIMER &&
                            timeRemaining && (
                                <Text fontSize="sm" color="primary.green.900">
                                    Time remaining: {timeRemaining}
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
