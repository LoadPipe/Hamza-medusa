'use client';

import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Text } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CategoryHero from '@/modules/categories/components/category-banner';
import CategoryTemplate from '@/modules/categories';

type Params = {
    params: {
        countryCode: string;
        handle: string;
    };
};

export default function CategoryShopPage({ params }: Params) {
    const { handle, countryCode } = params;

    if (handle?.toLowerCase() === 'giftcards') {
        redirect(`/${countryCode}/category/gift-cards`);
    }

    const decodedHandle = decodeURIComponent(handle);
    const normalizedHandle = decodedHandle.trim().replace(/[\s_]+/g, '-').toLowerCase();

    if (handle !== normalizedHandle) {
        redirect(`/${countryCode}/category/${normalizedHandle}`);
    }

    return (
        <Box
            style={{
                background: 'linear-gradient(to bottom, #020202 20vh, #2C272D 70vh)',
            }}
        >
            {/* Breadcrumb Section */}
            <Flex
                maxW="1340px"
                w="100%"
                mx="auto"
                px={{ base: '1rem', md: '2rem' }}
                pt="5.5rem"
                alignItems="center"
            >
                <Breadcrumb
                    fontWeight="medium"
                    fontSize="sm"
                    spacing="8px"
                    separator="/"
                    color="whiteAlpha.800"
                >
                    <BreadcrumbItem>
                        <BreadcrumbLink as={Link} href={`/${countryCode}`}>
                            Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink _hover={{ textDecoration: 'none' }}>
                            {normalizedHandle.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </Flex>


            {/* Hero Section */}
            <CategoryHero category={normalizedHandle} />

            {/* Main Shop Template */}
            <CategoryTemplate category={normalizedHandle} />
        </Box>
    );
}
