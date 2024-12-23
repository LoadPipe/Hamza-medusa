import React from 'react';
import { motion } from 'framer-motion';
import { formatDate, formatStatus } from '@utils/format-data.ts';

interface TimelineEvent {
    title: string;
    details: string;
    timestamp?: string;
}

interface TimelineProps {
    orderDetails: {
        created_at: string;
        updated_at: string;
        status: string;
        fulfillment_status: string;
        payment_status: string;
        histories?: Array<{
            id: string;
            title: string;
            to_status?: string | null;
            to_payment_status?: string | null;
            to_fulfillment_status?: string | null;
            metadata?: Record<string, any>;
            created_at: string;
        }>;
        refunds?: Array<{
            id: string;
            amount: number;
            note?: string | null;
            reason: string;
            created_at: string;
        }>;
    };
}

const OrderTimeline: React.FC<TimelineProps> = ({ orderDetails }) => {
    const events: TimelineEvent[] = [];

    // Base event: Order created
    events.push({
        title: 'Order Placed',
        details: 'The order was created.',
        timestamp: formatDate(orderDetails.created_at),
    });

    // Add order status update if it differs from the initial creation
    if (orderDetails.updated_at !== orderDetails.created_at) {
        events.push({
            title: 'Order Updated',
            details: `Order status updated to ${formatStatus(orderDetails.status)}.`,
            timestamp: formatDate(orderDetails.updated_at),
        });
    }

    // Add fulfillment and payment statuses
    if (orderDetails.fulfillment_status) {
        events.push({
            title: 'Fulfillment Status',
            details: `Fulfillment is currently ${formatStatus(
                orderDetails.fulfillment_status
            )}.`,
        });
    }

    if (orderDetails.payment_status) {
        events.push({
            title: 'Payment Status',
            details: `Payment is currently ${formatStatus(orderDetails.payment_status)}.`,
        });
    }

    // Add historical events from `histories` array
    orderDetails.histories?.forEach((history) => {
        const details = [];
        if (history.to_status) {
            details.push(`Status: ${history.to_status}`);
        }
        if (history.to_payment_status) {
            details.push(`Payment: ${history.to_payment_status}`);
        }
        if (history.to_fulfillment_status) {
            details.push(`Fulfillment: ${history.to_fulfillment_status}`);
        }

        events.push({
            title:
                history.title.charAt(0).toUpperCase() + history.title.slice(1),
            details: details.join(', '), // Combine available details
            timestamp: formatDate(history.created_at),
        });
    });

    // Add refund events from `refunds` array
    orderDetails.refunds?.forEach((refund) => {
        events.push({
            title: 'Refund Issued',
            details: `Amount: ${
                refund.amount / 100
            } USDT, Reason: ${refund.reason}. Note: ${refund.note || 'No notes.'}`,
            timestamp: formatDate(refund.created_at),
        });
    });

    // Determine the most recent event (last item in events)
    const recentIndex = events.length - 1;

    return (
        <div className="flex flex-col">
            <h2 className="text-primary-black-60 text-sm leading-relaxed mb-4">
                TIMELINE
            </h2>
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute top-0 left-2.5 h-full border-l border-primary-black-60"></div>
                {events.map((event, index) => (
                    <motion.div
                        key={index}
                        className="flex items-start mb-[24px] last:mb-0"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        {/* Dot */}
                        <motion.div
                            className="relative flex items-center justify-center h-5 w-5 rounded-full border-2 border-white"
                            style={{
                                backgroundColor:
                                    index === recentIndex ? 'green' : 'black',
                            }}
                            animate={
                                index === recentIndex
                                    ? {
                                          scale: [1.2, 1.5, 1.2],
                                          backgroundColor: [
                                              '#28a745',
                                              '#34d058',
                                              '#28a745',
                                          ], // Green animation
                                      }
                                    : {}
                            }
                            transition={
                                index === recentIndex
                                    ? { repeat: 5, duration: 1.5 }
                                    : {}
                            }
                        >
                            <motion.div
                                className="h-2.5 w-2.5 bg-primary-black-60 rounded-full"
                                animate={
                                    index === recentIndex
                                        ? {
                                              scale: [0.8, 1, 0.8],
                                              opacity: [0.8, 1, 0.8],
                                          }
                                        : {}
                                }
                                transition={
                                    index === recentIndex
                                        ? { repeat: 5, duration: 1.5 }
                                        : {}
                                }
                            />
                        </motion.div>
                        {/* Event Content */}
                        <div className="ml-4 flex-1">
                            <div className="flex justify-between mb-[16px]">
                                <h3 className="text-white font-bold">
                                    {event.title}
                                </h3>
                                {event.timestamp && (
                                    <span className="text-primary-black-60 text-sm">
                                        {event.timestamp}
                                    </span>
                                )}
                            </div>
                            <p className="text-primary-black-60 text-sm">
                                {event.details}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default OrderTimeline;
