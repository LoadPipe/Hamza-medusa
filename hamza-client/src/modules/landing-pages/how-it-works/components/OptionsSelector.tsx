'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@modules/landing-pages/how-it-works/components/ui/button';

const options = [
    { type: 'Language', choices: ['English', 'Spanish', 'French', 'German'] },
    { type: 'Currency', choices: ['USD', 'EUR', 'GBP', 'JPY'] },
    { type: 'Shipping', choices: ['Worldwide', 'USA', 'Europe', 'Asia'] },
];

export default function OptionsSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState({
        Language: 'English',
        Currency: 'USD',
        Shipping: 'Worldwide',
    });

    return (
        <div className="relative">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#242424] text-white px-4 py-2 rounded-full flex items-center"
            >
                <span>Options</span>
                <ChevronDown className="ml-2" size={16} />
            </Button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-[252px] bg-[#242424] rounded-xl shadow-lg z-10">
                    {options.map((option) => (
                        <div
                            key={option.type}
                            className="p-4 border-b border-[#333] last:border-b-0"
                        >
                            <h3 className="text-sm font-semibold mb-2 text-white">
                                {option.type}
                            </h3>
                            {/*<div className="flex flex-wrap gap-2">
                                {option.choices.map((choice) => (
                                    <Button
                                        key={choice}
                                        size="sm"
                                        variant={
                                            selectedOptions[option.type] ===
                                            choice
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() =>
                                            setSelectedOptions({
                                                ...selectedOptions,
                                                [option.type]: choice,
                                            })
                                        }
                                        className="text-xs"
                                    >
                                        {choice}
                                    </Button>
                                ))}
                            </div>*/}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
