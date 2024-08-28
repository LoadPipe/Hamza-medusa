'use client';

import React, { useEffect, useState } from 'react';
import { Flex, Box, Text, Input } from '@chakra-ui/react';
import VendorCatButton from './vendor-cat-button';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCardGroup from '@modules/products/components/product-group-vendor';

type Props = {
    vendorName: string;
};

const VendorSearch = ({ vendorName }: Props) => {
    const [allProducts, setAllProducts] = useState(true);
    const [handle, setHandle] = useState('shirts');

    // Get categories and update buttons
    const { data, error, isLoading } = useQuery(
        ['categories', vendorName],
        () => {
            const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/store/categories?store_name=${vendorName}`;
            return axios.get(url);
        }
    );

    let uniqueHandlesArray: string[] = [];

    if (data && data.data) {
        const uniqueHandles = new Set<string>();

        data.data.forEach((item: any) => {
            const handle = item?.handle;
            if (handle) {
                // Remove underscores and convert the string to a more readable format
                const formattedHandle = handle
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (char) => char.toUpperCase());
                uniqueHandles.add(formattedHandle);
            }
        });

        uniqueHandlesArray = Array.from(uniqueHandles);
        console.log(uniqueHandlesArray);
    } else {
        console.log('No data available');
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading categories</div>;
    }

    console.log(handle);

    return (
        <Flex flexDir={'column'} width={'100%'}>
            <Flex
                mx={{ base: '1rem', md: '0' }}
                flexDir={'row'}
                maxWidth={'1256.52px'}
                width={'100%'}
                my={{ base: '1rem', md: '3rem' }}
                gap={'1rem'}
            >
                <VendorCatButton catName="All Products" />

                {uniqueHandlesArray.map((handle, index) => (
                    <VendorCatButton
                        key={index}
                        catName={handle}
                        setHandle={setHandle}
                        setAllProducts={setAllProducts}
                    />
                ))}
                {/* <Flex ml="auto" alignSelf={'center'}>
                    <Input
                        height={'66px'}
                        width={'385px'}
                        borderRadius={'48px'}
                        borderColor={'#555555'}
                        backgroundColor={'#121212'}
                    />
                </Flex> */}
            </Flex>
            <Box mt="2rem">
                {/* Add margin to ensure buttons are not overlapped */}
                <ProductCardGroup
                    vendorName={vendorName}
                    allProducts={true}
                    handle={handle}
                />
            </Box>
        </Flex>
    );
};

export default VendorSearch;
