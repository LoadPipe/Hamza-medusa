'use client';

import React, { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import StoreCatButton from './store-cat-button';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCardGroup from '@modules/products/components/product-group-vendor';
import useVendor from '@store/store-page/vendor';

type Props = {
    storeName: string;
};

const StoreSearch = ({ storeName }: Props) => {
    // Category button hooks
    const [categoryName, setCategoryName] = useState('all');
    const [selectedButton, setSelectedButton] = useState('All Products'); // Track selected button

    // Get categories and update buttons
    const { data, error, isLoading } = useQuery(
        ['categories', storeName],
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
            if (handle) {
                uniqueHandles.add(handle);
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
                <StoreCatButton
                    catName={'All Products'}
                    setCategoryName={setCategoryName}
                    setSelected={setSelectedButton}
                    selected={selectedButton}
                />

                {uniqueHandlesArray.map((handle, index) => (
                    <StoreCatButton
                        key={index}
                        catName={handle}
                        setCategoryName={setCategoryName}
                        setSelected={setSelectedButton}
                        selected={selectedButton}
                    />
                ))}
            </Flex>

            <ProductCardGroup
                storeName={storeName}
                categoryName={categoryName}
            />
        </Flex>
    );
};

export default StoreSearch;
