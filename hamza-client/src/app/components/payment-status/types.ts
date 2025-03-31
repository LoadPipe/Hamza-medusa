export enum StepDisplayState {
    COMPLETED = 'completed',
    ACTIVE = 'active',
    ACTIVE_WITH_TIMER = 'active_with_timer',
    INACTIVE = 'inactive',
}

export interface StatusStep {
    label: string;
    subLabel: string;
    status: string;
}

export interface StatusStepDisplayProps {
    step: StatusStep;
    index: number;
    progress?: number;
    statusColor: string;
    displayState: StepDisplayState;
    timeRemaining?: string;
}

export const STATUS_STEPS: StatusStep[] = [
    {
        label: 'Created',
        subLabel: 'Payment request created',
        status: 'created',
    },
    {
        label: 'Waiting',
        subLabel: 'Waiting for payment to arrive',
        status: 'waiting',
    },
    {
        label: 'Received',
        subLabel: 'Payment received',
        status: 'received',
    },
    {
        label: 'In Escrow',
        subLabel: 'Funds secured in escrow',
        status: 'in_escrow',
    },
];

export const formatTimeRemaining = (
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

export const calculateStepState = (
    stepStatus: string,
    currentStatus: string,
    progress: number,
    endTimestamp: number,
    startTimestamp: number
): { displayState: StepDisplayState; timeRemaining?: string } => {
    // Get the indices of the current step and current status in STATUS_STEPS
    const currentStepIndex = STATUS_STEPS.findIndex(
        (step) => step.status === stepStatus
    );
    const currentStatusIndex = STATUS_STEPS.findIndex(
        (step) => step.status === currentStatus
    );

    // If this is the current step
    if (stepStatus === currentStatus) {
        // If it's waiting and has time remaining
        if (stepStatus === 'waiting' && progress < 100) {
            const timeRemaining = Math.floor(
                (((100 - progress) / 100) * (endTimestamp - startTimestamp)) /
                    1000
            );
            return {
                displayState:
                    timeRemaining > 0
                        ? StepDisplayState.ACTIVE_WITH_TIMER
                        : StepDisplayState.ACTIVE,
                timeRemaining:
                    timeRemaining > 0
                        ? formatTimeRemaining(
                              progress,
                              endTimestamp,
                              startTimestamp
                          )
                        : undefined,
            };
        }
        return { displayState: StepDisplayState.ACTIVE };
    }

    // If this step is before the current status in the order
    if (currentStepIndex < currentStatusIndex) {
        return { displayState: StepDisplayState.COMPLETED };
    }

    // If this step is after the current status in the order
    return { displayState: StepDisplayState.INACTIVE };
};

export const getStepColors = (
    displayState: StepDisplayState,
    statusColor: string
) => {
    const lineColor = (() => {
        switch (displayState) {
            case StepDisplayState.COMPLETED:
            case StepDisplayState.ACTIVE:
            case StepDisplayState.ACTIVE_WITH_TIMER:
                return '#94D42A';
            case StepDisplayState.INACTIVE:
                return 'gray.600';
        }
    })();

    const iconColor = (() => {
        switch (displayState) {
            case StepDisplayState.COMPLETED:
                return '#94D42A';
            case StepDisplayState.ACTIVE:
            case StepDisplayState.ACTIVE_WITH_TIMER:
                return 'white';
            case StepDisplayState.INACTIVE:
                return statusColor;
        }
    })();

    const textColor = (() => {
        switch (displayState) {
            case StepDisplayState.COMPLETED:
                return '#94D42A';
            case StepDisplayState.ACTIVE:
            case StepDisplayState.ACTIVE_WITH_TIMER:
                return 'white';
            case StepDisplayState.INACTIVE:
                return statusColor;
        }
    })();

    return { lineColor, iconColor, textColor };
};
