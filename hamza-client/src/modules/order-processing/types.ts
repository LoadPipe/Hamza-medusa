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
