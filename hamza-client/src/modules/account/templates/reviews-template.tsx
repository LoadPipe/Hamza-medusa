'use client';

import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import ReviewPage from '@/modules/account/components/reviews';
import React from 'react';

const ReviewTemplate = ({
    customer,
    dehydratedState,
}: {
    customer: any;
    dehydratedState: any;
}) => {
    return (
        <>
            <HydrationBoundary state={dehydratedState}>
                <ReviewPage customer={customer} />
            </HydrationBoundary>
        </>
    );
};

export default ReviewTemplate;
