import { getPaymentData, retrieveOrder } from '@/lib/server';
import { STATUS_STEPS, StepDisplayState } from './types';
import {
    LineItem,
    Order,
    PaymentsDataProps,
} from '@/app/[countryCode]/(main)/order/processing/[id]/page';
import { notFound } from 'next/navigation';
import { enrichLineItems } from '../cart/actions';

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
    // Map special statuses to their base status
    const effectiveStatus = (() => {
        switch (currentStatus) {
            case 'expired':
                return 'waiting';
            case 'partial':
                return 'received';
            default:
                return currentStatus;
        }
    })();

    // Get the indices of the current step and current status in STATUS_STEPS
    const currentStepIndex = STATUS_STEPS.findIndex(
        (step) => step.status === stepStatus
    );
    const currentStatusIndex = STATUS_STEPS.findIndex(
        (step) => step.status === effectiveStatus
    );

    // If this is the current step
    if (stepStatus === effectiveStatus) {
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
    stepStatus: string,
    currentStatus: string
) => {
    // Map special statuses to their base status
    const effectiveStatus = (() => {
        switch (currentStatus) {
            case 'expired':
                return 'waiting';
            case 'partial':
                return 'received';
            default:
                return currentStatus;
        }
    })();

    const statusIndex = STATUS_STEPS.findIndex(
        (step) => step.status === effectiveStatus
    );
    const stepIndex = STATUS_STEPS.findIndex(
        (step) => step.status === stepStatus
    );

    const isCompletedOrActive = stepIndex <= statusIndex;
    const isExpired = currentStatus === 'expired' && stepStatus === 'waiting';
    const isPartial = currentStatus === 'partial' && stepStatus === 'received';

    const lineColor = (() => {
        if (isExpired) return '#E53E3E'; // red.500
        if (isPartial) return '#F6AD55'; // orange.400
        switch (displayState) {
            case StepDisplayState.COMPLETED:
                return '#94D42A';
            case StepDisplayState.ACTIVE:
                return '#94D42A';
            case StepDisplayState.ACTIVE_WITH_TIMER:
            case StepDisplayState.INACTIVE:
                return 'gray.600';
        }
    })();

    const iconColor = (() => {
        if (isExpired) return '#E53E3E'; // red.500
        if (isPartial) return '#F6AD55'; // orange.400
        switch (displayState) {
            case StepDisplayState.COMPLETED:
                return '#94D42A';
            case StepDisplayState.ACTIVE:
            case StepDisplayState.ACTIVE_WITH_TIMER:
                return 'white';
            case StepDisplayState.INACTIVE:
                return isCompletedOrActive ? 'primary.green.900' : 'gray.600';
        }
    })();

    const textColor = (() => {
        if (isExpired) return '#E53E3E'; // red.500
        if (isPartial) return '#F6AD55'; // orange.400
        switch (displayState) {
            case StepDisplayState.COMPLETED:
                return '#94D42A';
            case StepDisplayState.ACTIVE:
            case StepDisplayState.ACTIVE_WITH_TIMER:
                return 'white';
            case StepDisplayState.INACTIVE:
                return isCompletedOrActive ? 'primary.green.900' : 'gray.600';
        }
    })();

    return { lineColor, iconColor, textColor };
};

export const buildPaymentsData = async (cartId: string) => {
    const paymentsData = await getPaymentData(cartId);

    const startTimestamp =
        paymentsData[0].startTimestamp > 0
            ? paymentsData[0].startTimestamp
            : new Date(paymentsData[0].orders[0].created_at).getTime();

    const endTimestamp =
        paymentsData[0].startTimestamp > 0
            ? paymentsData[0].startTimestamp
            : Date.now() + Number(paymentsData[0].expiresInSeconds) * 1000;

    await Promise.all(
        paymentsData.map(async (paymentData: PaymentsDataProps) => {
            await Promise.all(
                paymentData.orders.map(async (order: Order) => {
                    const enrichedOrder = await getOrder(order.id);
                    order.items = enrichedOrder.order.items;
                    order.detail = enrichedOrder.order;
                })
            );
        })
    );

    return { paymentsData, startTimestamp, endTimestamp };
};

async function getOrder(id: string) {
    const order = await retrieveOrder(id);

    if (!order) {
        console.log('order', id, ' not found');
        return notFound();
    }

    // console.log(`ORDERS ${JSON.stringify(order)}`);

    const enrichedItems = await enrichLineItems(order.items, order.region_id);

    return {
        order: {
            ...order,
            items: enrichedItems as LineItem[],
        } as Order,
    };
}
