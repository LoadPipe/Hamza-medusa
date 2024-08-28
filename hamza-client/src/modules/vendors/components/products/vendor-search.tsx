'use client';

import React, { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import VendorCatButton from './vendor-cat-button';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCardGroup from '@modules/products/components/product-group-vendor';
import { getStoreIdByName } from '@lib/data';

type Props = {
    vendorName: string;
};

const VendorSearch = ({ vendorName }: Props) => {
    // Category button hooks
    const [handle, setHandle] = useState('all');
    const [selectedButton, setSelectedButton] = useState('All Products'); // Track selected button
    const [storeId, setStoreId] = useState<string | null>(null);

    // Get store id
    useEffect(() => {
        async function fetchStoreId() {
            const id = await getStoreIdByName(vendorName);
            setStoreId(id);
        }
        fetchStoreId();
    }, [vendorName]);

    // Get categories and update buttons
    const { data, error, isLoading } = useQuery(
        ['categories', vendorName],
        () => {
            const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/store/categories?store_name=${vendorName}`;
            return axios.get(url);
        }
    );

    // Filter for unique hamdles
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

    // API is loading
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Error reaching api
    if (error) {
        return <div>Error loading categories</div>;
    }

    return (
        <Flex flexDir={'column'} width={'100%'}>
            <Flex
                mx={'1rem'}
                flexDir={'row'}
                maxWidth={'1256.52px'}
                width={'100%'}
                my={{ base: '1rem', md: '3rem' }}
                gap={'1rem'}
            >
                <VendorCatButton
                    catName={'All Products'}
                    setHandle={setHandle}
                    setSelected={setSelectedButton}
                    selected={selectedButton}
                />

                {uniqueHandlesArray.map((handle, index) => (
                    <VendorCatButton
                        key={index}
                        catName={handle}
                        setHandle={setHandle}
                        setSelected={setSelectedButton}
                        selected={selectedButton}
                    />
                ))}
            </Flex>

            <ProductCardGroup
                vendorName={vendorName}
                allProducts={true}
                handle={handle}
            />
        </Flex>
    );
};

export default VendorSearch;
