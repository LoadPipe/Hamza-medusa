import React from 'react';
import Image from 'next/image';
import { Text, Flex } from '@chakra-ui/react';
import currencyIcons from '../../../data/crypto-currencies';
import useModalFilter from '@store/store-page/filter-modal';
interface CurrencyButtonProps {
    currencyName: 'ETH' | 'USDC' | 'USDT';
}

const CurrencyModalButton: React.FC<CurrencyButtonProps> = ({
    currencyName,
}) => {
    const { modalCurrencyFilterSelect, setModalCurrencyFilterSelect } =
        useModalFilter();

    return (
        <Flex>
            <Flex
                borderColor={'secondary.davy.900'}
                backgroundColor={
                    modalCurrencyFilterSelect === currencyName
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
                    modalCurrencyFilterSelect === currencyName
                        ? 'black'
                        : 'white'
                }
                style={{ padding: '10px 24px' }}
                transition="background 0.1s ease-in-out, color 0.1s ease-in-out"
                _hover={{
                    background: 'white',
                    color: 'black',
                }}
                onClick={() => setModalCurrencyFilterSelect(currencyName)}
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

export default CurrencyModalButton;
