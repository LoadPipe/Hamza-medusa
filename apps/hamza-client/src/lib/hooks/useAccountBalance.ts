import { useCallback, useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';
import { Address } from 'viem';
import { useBalance } from 'wagmi';

export function useAccountBalance(address?: Address) {
    const [isEthBalance, setIsEthBalance] = useState(true);
    const [balance, setBalance] = useState<number | null>(null);
    const { chain } = useNetwork();
    const price = chain?.nativeCurrency.decimals ?? 0;

    const {
        data: fetchedBalanceData,
        isError,
        isLoading,
    } = useBalance({
        address,
        watch: true,
        chainId: chain?.id,
    });

    const onToggleBalance = useCallback(() => {
        if (price > 0) {
            setIsEthBalance(!isEthBalance);
        }
    }, [isEthBalance, price]);

    useEffect(() => {
        if (fetchedBalanceData?.formatted) {
            setBalance(Number(fetchedBalanceData.formatted));
        }
    }, [fetchedBalanceData, chain?.id]);

    return {
        balance,
        price,
        isError,
        isLoading,
        onToggleBalance,
        isEthBalance,
    };
}
