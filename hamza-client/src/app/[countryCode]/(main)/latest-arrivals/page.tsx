'use client';

import { Box, Flex, Text, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import Link from 'next/link';
import LatestArrivalsTemplate from '@/modules/latest-arrivals';

type Params = {
    params: { countryCode: string };
};

export default function LatestArrivalsPage({ params }: Params) {
    const { countryCode } = params;

    return (
        <Box style={{
            background: 'linear-gradient(to bottom, #020202 20vh, #2C272D 70vh)',
        }}>
            <Flex maxW="1340px" w="100%" mx="auto" px={{ base: '1rem', md: '2rem' }} pt="5.5rem" alignItems="center">
                <Breadcrumb fontWeight="medium" fontSize="sm" spacing="8px" separator="/" color="whiteAlpha.800">
                    <BreadcrumbItem>
                        <BreadcrumbLink as={Link} href={`/${countryCode}`}>Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink _hover={{ textDecoration: 'none' }}>Latest Arrivals</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </Flex>
            <LatestArrivalsTemplate />
        </Box>
    );
}
