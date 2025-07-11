'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@modules/landing-pages/how-it-works/components/ui/button';

const currencies = [
    { name: 'USD', symbol: '$', flag: '🇺🇸' },
    { name: 'EUR', symbol: '€', flag: '🇪🇺' },
    { name: 'GBP', symbol: '£', flag: '🇬🇧' },
    { name: 'JPY', symbol: '¥', flag: '🇯🇵' },
];

export default function CurrencySelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

    return (
        <div className="relative">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#242424] text-white px-4 py-2 rounded-full flex items-center"
            >
                <span className="mr-2">{selectedCurrency.flag}</span>
                <span>{selectedCurrency.name}</span>
                <ChevronDown className="ml-2" size={16} />
            </Button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-[200px] bg-[#242424] rounded-xl shadow-lg">
                    {currencies.map((currency) => (
                        <div
                            key={currency.name}
                            className="p-4 hover:bg-[#333] cursor-pointer flex items-center justify-between"
                            onClick={() => {
                                setSelectedCurrency(currency);
                                setIsOpen(false);
                            }}
                        >
                            <div className="flex items-center">
                                <span className="mr-2 text-2xl">
                                    {currency.flag}
                                </span>
                                <span>{currency.name}</span>
                            </div>
                            <span>{currency.symbol}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
