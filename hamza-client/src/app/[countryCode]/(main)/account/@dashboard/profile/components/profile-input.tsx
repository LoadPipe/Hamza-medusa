import { Flex, Text, Input } from '@chakra-ui/react';
import React from 'react';

const ProfileInput = (props: any) => {
    return (
        <Flex flexDirection={'column'} maxW={'420px'} width={'100%'}>
            <Text
                textTransform={'uppercase'}
                fontSize={'12px'}
                pl="1rem"
                mb={'8px'}
            >
                {props.label}
            </Text>
            <Input
                borderRadius={'12px'}
                height={'52px'}
                backgroundColor={'#020202'}
                border={'none'}
            />
        </Flex>
    );
};

export default ProfileInput;
