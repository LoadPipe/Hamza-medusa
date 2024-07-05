import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import FilterIcon from '../../../../../../../../public/images/categories/mobile-filter.svg';
import { LuSlidersHorizontal } from 'react-icons/lu';

type FilterButtonProps = {
    onClick: any;
};

const FilterButton = ({ onClick }: FilterButtonProps) => {
    return (
        <Flex
            flexShrink={0}
            onClick={onClick}
            display={'flex'}
            flexDirection={'row'}
            alignItems={'center'}
            borderWidth={'1px'}
            borderRadius={'49px'}
            height={{ base: '42px', md: '63px' }}
            cursor="pointer"
            style={{ padding: '10px 24px' }}
            color={'white'}
            // transition="background 0.1s ease-in-out, color 0.1s ease-in-out"
            _hover={{
                color: 'black',
                backgroundColor: 'white',
            }}
        >
            <LuSlidersHorizontal
                style={{ width: '18px', height: '18px', alignSelf: 'center' }}
            />
            {/* <Image
                style={{
                    width: '18px',
                    height: '18px',
                    alignSelf: 'center',
                    filter: 'invert(51%) sepia(97%) saturate(6474%) hue-rotate(207deg) brightness(94%) contrast(101%)',
                }}
                src={FilterIcon}
                alt="mobile filter"
            /> */}
            <Text ml="10px" fontSize={{ base: '14px', md: '18px' }}>
                Filter
            </Text>
        </Flex>
    );
};

export default FilterButton;
