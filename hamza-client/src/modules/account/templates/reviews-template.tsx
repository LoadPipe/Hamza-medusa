'use client';

import { Hydrate } from '@tanstack/react-query';
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
            <Hydrate state={dehydratedState}>
                <ReviewPage customer={customer} />
            </Hydrate>
        </>
    );
};

export default ReviewTemplate;
