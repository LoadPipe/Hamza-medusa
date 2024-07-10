import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Text, Flex } from '@chakra-ui/react';

const FilterTag = (props: any) => {
    return (
        <Flex>
            <Flex
                backgroundColor={'#020202'}
                borderColor={'#3E3E3E'}
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                borderWidth={'1px'}
                borderRadius={'49px'}
                height={'63px'}
                style={{ padding: '10px 24px' }}
            >
                <Image src={props.img} alt={props.name} />
                <Text ml="10px" fontSize="18px" color="white">
                    {props.name}
                </Text>
            </Flex>
        </Flex>
    );
};

export default FilterTag;
