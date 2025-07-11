import type React from 'react';
import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';

interface Stats {
    totalVolume: number;
    transactions: number;
    averagePrice: number;
    percentChange: number;
}

interface TransactionStatsProps {
    stats: Stats;
    translate: (key: string, lang?: string) => string;
    selectedLanguage: string;
    selectedCurrency: string;
}

const TransactionStats: React.FC<TransactionStatsProps> = ({
    stats,
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
        return new Intl.NumberFormat(selectedLanguage).format(num);
    };

    return (
        <div className="mt-16 max-w-[1200px] mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                    <BarChart2 className="mr-2 h-8 w-8 text-[#BB86FC]" />
                    {translate('Transaction Stats', selectedLanguage)}
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-[#121212] rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {translate('Total Volume', selectedLanguage)}
                        </h3>
                        <p className="text-2xl font-bold text-[#BB86FC]">
                            {formatCurrency(stats.totalVolume)}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-[#121212] rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {translate('Transactions', selectedLanguage)}
                        </h3>
                        <p className="text-2xl font-bold text-[#BB86FC]">
                            {formatNumber(stats.transactions)}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-[#121212] rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {translate('Average Price', selectedLanguage)}
                        </h3>
                        <p className="text-2xl font-bold text-[#BB86FC]">
                            {formatCurrency(stats.averagePrice)}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-[#121212] rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {translate('24h Change', selectedLanguage)}
                        </h3>
                        <p
                            className={`text-2xl font-bold flex items-center ${stats.percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
                        >
                            {stats.percentChange >= 0 ? (
                                <TrendingUp className="mr-2" />
                            ) : (
                                <TrendingDown className="mr-2" />
                            )}
                            {stats.percentChange}%
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TransactionStats;
