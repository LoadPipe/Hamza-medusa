import React from 'react';
import Image from 'next/image';
import { Text, Flex } from '@chakra-ui/react';
import currencyIcons from '../data/crypto-currencies';
import useSideFilter from '@store/store-page/side-filter';

interface CurrencyButtonProps {
    currencyName: 'ETH' | 'USDC' | 'USDT';
}

const CurrencyButton: React.FC<CurrencyButtonProps> = ({ currencyName }) => {
    const { currencyFilterSelect, setCurrencyFilterSelect } = useSideFilter();

    return (
        <Flex>
            <Flex
                borderColor={'secondary.davy.900'}
                backgroundColor={
                    currencyFilterSelect === currencyName
                        ? 'white'
                        : 'transparent'
                }
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'center'}
                alignItems={'center'}
                borderWidth={'1px'}
                borderRadius={'49px'}
                cursor="pointer"
                height={'60px'}
                color={
                    currencyFilterSelect === currencyName ? 'black' : 'white'
                }
                style={{ padding: '10px 24px' }}
                transition="background 0.1s ease-in-out, color 0.1s ease-in-out"
                _hover={{
                    background: 'white',
                    color: 'black',
                }}
                onClick={() => setCurrencyFilterSelect(currencyName)}
            >
                <Image src={currencyIcons[currencyName ?? 'usdc']} alt={currencyName ?? 'usdc'} />
                <Text
                    fontSize={{ base: '14px', md: '16px' }}
                    ml={{ base: '0.5rem', md: '0.75rem' }}
                >
                    {currencyName}
                </Text>
            </Flex>
        </Flex>
    );
};

export default CurrencyButton;
