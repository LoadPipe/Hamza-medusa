import type React from 'react';
import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { ArrowRight, Flame } from 'lucide-react';

interface Deal {
    id: string;
    name: string;
    image: string;
    originalPrice: number;
    discountedPrice: number;
    discountPercentage: number;
    timeLeft: string;
}

interface HotDealsGridProps {
    deals: Deal[];
    translate: (key: string, lang?: string) => string;
    selectedLanguage: string;
    selectedCurrency: string;
}

const HotDealsGrid: React.FC<HotDealsGridProps> = ({
    deals,
    translate,
    selectedLanguage,
    selectedCurrency,
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(selectedLanguage, {
            style: 'currency',
            currency: selectedCurrency,
        }).format(amount);
    };

    return (
        <div className="mt-16 max-w-[1200px] mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                    <Flame className="mr-2 h-8 w-8 text-[#BB86FC]" />
                    {translate('Hot Deals', selectedLanguage)}
                </h2>
                <button className="text-[#BB86FC] hover:text-[#9D4EDD] transition-colors flex items-center">
                    {translate('View All Deals', selectedLanguage)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {deals.map((deal) => (
                    <Card
                        key={deal.id}
                        className="bg-black rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-800"
                    >
                        <div className="h-48 overflow-hidden">
                            <img
                                src={deal.image || '/placeholder.svg'}
                                alt={deal.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <CardContent className="p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">
                                {translate(deal.name, selectedLanguage)}
                            </h3>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm line-through text-gray-400">
                                    {formatCurrency(deal.originalPrice)}
                                </span>
                                <span className="text-lg font-bold text-[#BB86FC]">
                                    {formatCurrency(deal.discountedPrice)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-medium text-green-500">
                                    -{deal.discountPercentage}%
                                </span>
                                <span className="text-sm font-medium text-white">
                                    {translate('Ends in', selectedLanguage)}{' '}
                                    {deal.timeLeft}
                                </span>
                            </div>
                            <button className="w-full bg-purple-500 text-white font-medium py-2 rounded-full hover:bg-purple-400 transition-colors">
                                {translate('Buy Now', selectedLanguage)}
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default HotDealsGrid;
