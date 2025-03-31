'use client';

import { Box, VStack, HStack, Text, Icon, Spinner } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

enum StepDisplayState {
    COMPLETED = 'completed',
    ACTIVE = 'active',
    ACTIVE_WITH_TIMER = 'active_with_timer',
    INACTIVE = 'inactive',
}

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

const getStepDisplayState = (
    stepStatus: string,
    currentStatus: string,
    progress: number,
    endTimestamp: number,
    startTimestamp: number
): StepDisplayState => {
    // If this step is completed (status is before current status)
    if (stepStatus === 'created' || stepStatus === 'completed') {
        return StepDisplayState.COMPLETED;
    }

    // If this is the current step
    if (stepStatus === currentStatus) {
        // If it's waiting and has time remaining
        if (stepStatus === 'waiting' && progress < 100) {
            const timeRemaining = Math.floor(
                (((100 - progress) / 100) * (endTimestamp - startTimestamp)) /
                    1000
            );
            return timeRemaining > 0
                ? StepDisplayState.ACTIVE_WITH_TIMER
                : StepDisplayState.ACTIVE;
        }
        return StepDisplayState.ACTIVE;
    }

    // If this step is after the current status
    return StepDisplayState.INACTIVE;
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
    const displayState = getStepDisplayState(
        step.status,
        currentStatus,
        progress,
        endTimestamp,
        startTimestamp
    );

    const getLineColor = () => {
        switch (displayState) {
            case StepDisplayState.COMPLETED:
                return '#94D42A';
            case StepDisplayState.ACTIVE:
            case StepDisplayState.ACTIVE_WITH_TIMER:
                return '#94D42A';
            case StepDisplayState.INACTIVE:
                return 'gray.600';
        }
    };

    const getIconColor = () => {
        switch (displayState) {
            case StepDisplayState.COMPLETED:
                return '#94D42A';
            case StepDisplayState.ACTIVE:
            case StepDisplayState.ACTIVE_WITH_TIMER:
                return 'white';
            case StepDisplayState.INACTIVE:
                return getStatusColor(step.status);
        }
    };

    const getTextColor = () => {
        switch (displayState) {
            case StepDisplayState.COMPLETED:
                return '#94D42A';
            case StepDisplayState.ACTIVE:
            case StepDisplayState.ACTIVE_WITH_TIMER:
                return 'white';
            case StepDisplayState.INACTIVE:
                return getStatusColor(step.status);
        }
    };

    return (
        <Box flex={1}>
            <VStack spacing={2} align="start">
                {/* Status Line */}
                <Box position="relative" w="100%" h="10px">
                    {/* Background line */}
                    <Box
                        h="10px"
                        borderRadius="5px"
                        bg={getLineColor()}
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
                            color={getIconColor()}
                            size="sm"
                            thickness="2px"
                            speed="0.8s"
                        />
                    ) : (
                        <Icon
                            as={CheckCircleIcon}
                            color={getIconColor()}
                            boxSize={5}
                            bg="gray.900"
                        />
                    )}
                    <VStack spacing={1} align="start" gap={0}>
                        <Text
                            fontSize="sm"
                            color={getTextColor()}
                            fontWeight="bold"
                        >
                            {step.label}
                        </Text>
                        {displayState ===
                            StepDisplayState.ACTIVE_WITH_TIMER && (
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
