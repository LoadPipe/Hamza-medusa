'use client';

import React from 'react';
import { Flex } from '@chakra-ui/react';
import StoreCatButton from './store-cat-button';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCardGroup from '@modules/products/components/product-group-store';

type Props = {
    storeName: string;
};

const StoreSearch = ({ storeName }: Props) => {
    // Get categories and update buttons
    const { data, error, isLoading } = useQuery(
        ['categoriesStore', storeName],
        () => {
            const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/store/categories?store_name=${storeName}`;
            return axios.get(url);
        }
    );

    // Filter for unique hamdles
    let uniqueHandlesArray: string[] = [];

    if (data && data.data) {
        const uniqueHandles = new Set<string>();

        data.data.forEach((item: any) => {
            const handle = item?.handle;
            console.log(item);
            if (handle) {
                uniqueHandles.add(handle);
            }
        });

        uniqueHandlesArray = Array.from(uniqueHandles);
        console.log(uniqueHandlesArray);
    } else {
        console.log('No data available');
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
                <StoreCatButton categoryName={'All'} />

                {uniqueHandlesArray.map((handle, index) => (
                    <StoreCatButton key={index} categoryName={handle} />
                ))}
            </Flex>

            <ProductCardGroup storeName={storeName} />
        </Flex>
    );
};

export default StoreSearch;
