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
                        className="h-[14px] w-[14px] md:h-[20px] md:w-[20px]"
                        src={currencyIcons[preferredCurrencyCode ?? 'usdc'].src}
                        alt={preferredCurrencyCode ?? 'usdc'}
                    />
                    <Text
                        ml={{ base: '8px', md: '8px' }}
                        as="h3"
                        variant="semibold"
                        color="white"
                        mt={1}
                        fontSize={{ base: '12px', md: '20px' }}
                        fontWeight={700}
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
