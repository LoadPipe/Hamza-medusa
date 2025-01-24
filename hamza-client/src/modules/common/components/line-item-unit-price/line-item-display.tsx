import currencyIcons from '../../../../../public/images/currencies/crypto-currencies';
import { Flex, Image, Text } from '@chakra-ui/react';

type LineItemUnitPriceDisplayProps = {
    price: string;
    preferredCurrencyCode?: string;
    useChakra?: boolean;
    classNames?: string;
};

export const LineItemUnitPriceDisplay = ({
    price,
    preferredCurrencyCode,
    useChakra,
    classNames,
}: LineItemUnitPriceDisplayProps) => {
    return (
        <>
            {useChakra ? (
                <Flex
                    flexDirection={'row'}
                    alignItems="center"
                    justifyContent={'flex-end'}
                >
                    <Image
                        className="h-[14px] w-[14px] md:h-[16px] md:w-[16px]"
                        src={currencyIcons[preferredCurrencyCode ?? 'usdc'].src}
                        alt={preferredCurrencyCode ?? 'usdc'}
                    />
                    <Text
                        ml={{ base: '8px', md: '8px' }}
                        fontSize={{ base: '12px', md: '16px' }}
                        fontWeight={700}
                        position="relative"
                        color={'white'}
                    >
                        {price}
                    </Text>
                </Flex>
            ) : (
                <span className={classNames}>{price}</span>
            )}
        </>
    );
};
