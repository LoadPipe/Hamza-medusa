'use client';

import { Hydrate } from '@tanstack/react-query';
import ReviewPage from '@/modules/account/components/reviews';
import React from 'react';

const commonButtonStyles = {
    width: { base: '100%', md: '200px', lg: '300px' },
    height: '56px',
    padding: '16px',
    bg: 'gray.900',
    borderColor: 'transparent',
    color: 'white',
    _hover: {
        bg: 'gray.200',
        color: 'black',
    },
    _active: {
        bg: 'primary.green.900',
        color: 'black',
        transform: 'scale(0.98)',
        borderColor: '#bec3c9',
    },
};

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
