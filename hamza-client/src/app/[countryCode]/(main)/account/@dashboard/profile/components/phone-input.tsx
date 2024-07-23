'use client';

import {
    Flex,
    Text,
    Input,
    InputLeftAddon,
    InputGroup,
    FormControl,
    FormLabel,
    Box,
} from '@chakra-ui/react';

import React, { useState } from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { css } from '@emotion/react';

const customStyles = css`
    .PhoneInput {
        width: 420px;
    }
    .PhoneInputInput {
        width: 420px;
        height: 40px;
        padding: 10px;
        font-size: 16px;
        background-color: #020202;
        border: 10px solid #020202;
        border-radius: 0 12px 12px 0;
    }
    .PhoneInputCountry {
        width: 51px;
        background-color: #272727;
        border-radius: 12px 0 0 12px;
    }
`;

const ProfilePhoneInput = (props: any) => {
    const [value, setValue] = useState();
    return (
        <FormControl id="phone" isRequired>
            <Text
                textTransform={'uppercase'}
                fontSize={'12px'}
                pl="1rem"
                mb={'8px'}
            >
                {props.label}
            </Text>
            <Box css={customStyles}>
                <PhoneInput
                    value={value}
                    onChange={setValue}
                    defaultCountry="US"
                />
            </Box>
        </FormControl>
    );
};

export default ProfilePhoneInput;
