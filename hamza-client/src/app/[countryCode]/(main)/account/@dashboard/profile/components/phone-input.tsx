import {
    Flex,
    Text,
    Input,
    InputLeftAddon,
    InputGroup,
} from '@chakra-ui/react';
import React from 'react';

const PhoneInput = (props: any) => {
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

            <InputGroup>
                <InputLeftAddon borderLeftRadius={'12px'}>
                    <Text color={'black'}>+234</Text>
                </InputLeftAddon>
                <Input
                    type="tel"
                    backgroundColor={'#020202'}
                    borderLeftRadius={'0px'}
                    borderRightRadius={'12px'}
                    border={'none'}
                />
            </InputGroup>
        </Flex>
    );
};

export default PhoneInput;
