'use server';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';

export default async function Test({
    searchParams,
}: {
    searchParams: { verify?: string; error?: string; reason?: string };
}) {
    const verifyStatus = searchParams.verify || 'Unknown';
    const errorStatus = searchParams.error || 'Unknown';
    const errorReason = decodeURIComponent(searchParams.reason || '');

    return (
        <Box backgroundColor={'transparent'}>
            <Text color={'white'}>Verification Status: {verifyStatus}</Text>
            <Text color={'white'}>Error Status: {errorStatus}</Text>
            {errorReason && <Text color={'white'}>Reason: {errorReason}</Text>}
        </Box>
    );
}
