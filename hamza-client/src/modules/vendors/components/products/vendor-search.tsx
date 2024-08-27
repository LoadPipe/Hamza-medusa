'use client';

import React, { useEffect } from 'react';
import { Flex, Box, Text, Input } from '@chakra-ui/react';
import VendorCatButton from './vendor-cat-button';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Props = {
    vendorName: string;
};

const VendorSearch = ({ vendorName }: Props) => {
    const { data, error, isLoading } = useQuery(['products'], () => {
        //TODO: MOVE TO INDEX.TS
        const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/store/categories?store_name=${vendorName}`;
        return axios.get(url);
    });

    return (
        <Flex
            my={{ base: '1rem', md: '3rem' }}
            maxWidth={'1256.52px'}
            width={'100%'}
        >
            <Flex mx={{ base: '1rem', md: '0' }} flexDir={'row'} width={'100%'}>
                <VendorCatButton catName="All Products" />

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
        </Flex>
    );
};

export default VendorSearch;
