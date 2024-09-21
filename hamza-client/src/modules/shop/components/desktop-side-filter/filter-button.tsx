import { Button, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import FilterIcon from '../../assets/filter-button.svg';
import useStorePage from '@store/store-page/store-page';
import useSideFilter from '@store/store-page/side-filter';

const FilterButton = () => {
    // Use Zustand shop to handle filter object
    const { setCategorySelect, setCategoryItem } = useStorePage();

    const {
        selectCategoryStoreFilter,
        setSelectCategoryStoreFilter,
        setCategoryItemSideFilter,
        categoryItemSideFilter,
    } = useSideFilter();

    const isDisabled = selectCategoryStoreFilter?.length === 0;

    return (
        <Button
            isDisabled={isDisabled}
            onClick={() => {
                // Delete current settings
                setCategorySelect([]);

                // Update settings
                if (
                    selectCategoryStoreFilter?.length > 0 &&
                    categoryItemSideFilter?.length > 0
                ) {
                    setCategorySelect(selectCategoryStoreFilter);
                    setCategoryItem(categoryItemSideFilter);
                    // Reset side menu states
                    setSelectCategoryStoreFilter([]);
                    setCategoryItemSideFilter([]);
                }

                // Scroll to the top of the page
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            }}
            backgroundColor={'secondary.onyx.900'}
            borderRadius={'56px'}
            borderWidth={'1px'}
            borderColor={'white'}
            width="100%"
            h={'3.5rem'}
            _hover={{
                backgroundColor: isDisabled
                    ? 'secondary.onyx.900'
                    : 'secondary.onyx.700',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
        >
            <Flex>
                <Image
                    src={FilterIcon}
                    alt="Filter Button"
                    width={24}
                    height={24}
                />
                <Text ml="1rem" color={'white'} fontSize={'18px'}>
                    Apply Filter
                </Text>
            </Flex>
        </Button>
    );
};

export default FilterButton;
