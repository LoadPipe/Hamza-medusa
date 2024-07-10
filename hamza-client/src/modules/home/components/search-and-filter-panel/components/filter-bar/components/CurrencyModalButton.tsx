import React from 'react';
import Image from 'next/image';
import { Text, Flex } from '@chakra-ui/react';
import currencyIcons from '../data/crypto-currency-icons';
import useModalFilter from '@store/store-page/filter-modal';
import useHomeModalFilter from '@store/home-page/home-filter/home-filter';
interface CurrencyButtonProps {
    currencyName: 'ETH' | 'USDC' | 'USDT';
}

const CurrencyModalButton: React.FC<CurrencyButtonProps> = ({
    currencyName,
}) => {
    const { homeModalCurrencyFilterSelect, setHomeModalCurrencyFilterSelect } =
        useHomeModalFilter();

    return (
        <Flex>
            <Flex
                borderColor={'secondary.davy.900'}
                backgroundColor={
                    homeModalCurrencyFilterSelect === currencyName
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
                color={
                    homeModalCurrencyFilterSelect === currencyName
                        ? 'black'
                        : 'white'
                }
                style={{ padding: '10px 24px' }}
                transition="background 0.1s ease-in-out, color 0.1s ease-in-out"
                _hover={{
                    background: 'white',
                    color: 'black',
                }}
                onClick={() => setHomeModalCurrencyFilterSelect(currencyName)}
            >
                <Image src={currencyIcons[currencyName]} alt={currencyName} />
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

export default CurrencyModalButton;
