import React, { useEffect, useState } from 'react';
import { Text, Flex } from '@chakra-ui/react';
import CategoryTopButton from './filter-carousel/category-top-button';
import useStorePage from '@/zustand/store-page/store-page';
import FilterTags from './desktop-filter-tags/filter-tags';
import { FaGreaterThan } from 'react-icons/fa';
import { CgChevronRight } from 'react-icons/cg';
import FilterBarStore from './filter-carousel/filter-bar-store';
import useVendors from '@modules/home/components/search-and-filter-panel/data/data';

const StoreFilterDisplay = () => {
    const { categorySelect } = useStorePage();
    const [isClient, setIsClient] = useState(false);
    const [startIdx, setStartIdx] = useState(0); // State to keep track of the starting index of visible vendors

    const vendors = useVendors();
    // Ensure that the components knows when it's running on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    const toggleShowMore = () => {
        // Update the starting index to show the next set of vendors
        const nextIndex = (startIdx + 1) % vendors.length; // Cycle through the list
        setStartIdx(nextIndex);
    };

    const visibleVendors = vendors
        .slice(startIdx, startIdx + 6)
        .concat(vendors.slice(0, Math.max(0, 6 - (vendors.length - startIdx))));

    return (
        <Flex
            display={{ base: 'none', md: 'flex' }}
            maxW={'941px'}
            width={'100%'}
            justifyContent={'flex-start'}
            flexDirection={'column'}
        >
            <Flex flexDirection={'column'} gap="1rem">
                <Flex gap="10px">
                    <Text color="White" fontSize={'18px'}>
                        Home
                    </Text>
                    <Flex alignSelf={'center'}>
                        <FaGreaterThan size={12} color="white" />
                    </Flex>
                    <Text fontSize={'18px'} color="primary.indigo.900">
                        {categorySelect ? categorySelect : 'All'}
                    </Text>
                </Flex>
                {/* top button filter */}

                <FilterBarStore />
                <Text fontSize={'18px'} color="primary.indigo.900">
                    Filters Applied
                </Text>
                <FilterTags />
            </Flex>
        </Flex>
    );
};

export default StoreFilterDisplay;
