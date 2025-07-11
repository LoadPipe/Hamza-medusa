import type React from 'react';
import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { ArrowRight, ShoppingCart } from 'lucide-react';

interface Buyer {
    id: string;
    name: string;
    image: string;
    totalSpent: number;
    itemsBought: number;
    decomEarned: number;
    rank: number;
}

interface TopBuyersProps {
    buyers: Buyer[];
    translate: (key: string, lang?: string) => string;
    selectedLanguage: string;
    selectedCurrency: string;
}

const TopBuyers: React.FC<TopBuyersProps> = ({
    buyers,
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

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    return (
        <div className="mt-16 max-w-[1200px] mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                    <ShoppingCart className="mr-2 h-8 w-8 text-purple-500" />
                    {translate('Top Buyers', selectedLanguage)}
                </h2>
                <button className="text-purple-500 hover:text-purple-400 transition-colors flex items-center">
                    {translate('View All', selectedLanguage)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </button>
            </div>
            <Card className="bg-black rounded-2xl overflow-hidden border border-gray-800">
                <CardContent className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="pb-3 text-sm font-medium text-gray-400">
                                        {translate('Rank', selectedLanguage)}
                                    </th>
                                    <th className="pb-3 text-sm font-medium text-gray-400">
                                        {translate('Buyer', selectedLanguage)}
                                    </th>
                                    <th className="pb-3 text-sm font-medium text-gray-400">
                                        {translate(
                                            'Total Spent',
                                            selectedLanguage
                                        )}
                                    </th>
                                    <th className="pb-3 text-sm font-medium text-gray-400">
                                        {translate(
                                            'Items Bought',
                                            selectedLanguage
                                        )}
                                    </th>
                                    <th className="pb-3 text-sm font-medium text-gray-400">
                                        {translate(
                                            'DECOM Earned',
                                            selectedLanguage
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {buyers.slice(0, 10).map((buyer) => (
                                    <tr
                                        key={buyer.id}
                                        className="border-b border-gray-800"
                                    >
                                        <td className="py-4 text-white">
                                            {buyer.rank}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center">
                                                <img
                                                    src={
                                                        buyer.image ||
                                                        '/placeholder.svg?height=40&width=40'
                                                    }
                                                    alt={buyer.name}
                                                    className="w-10 h-10 rounded-full object-cover mr-3"
                                                />
                                                <span className="text-white">
                                                    {buyer.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-white">
                                            {formatCurrency(buyer.totalSpent)}
                                        </td>
                                        <td className="py-4 text-white">
                                            {formatNumber(buyer.itemsBought)}
                                        </td>
                                        <td className="py-4 text-green-400">
                                            {formatNumber(buyer.decomEarned)}{' '}
                                            DECOM
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TopBuyers;
