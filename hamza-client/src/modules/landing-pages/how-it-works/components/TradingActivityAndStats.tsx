import type React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import {
    Activity,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import { cn } from '@modules/landing-pages/how-it-works/lib/utils';

interface TradeActivity {
    id: string;
    type: 'buy' | 'sell';
    product: string;
    amount: number;
    price: number;
    timestamp: string;
    decomEarned: number;
}

interface Stats {
    totalVolume: number;
    transactions: number;
    averagePrice: number;
    percentChange: number;
}

interface TradingActivityAndStatsProps {
    activities: TradeActivity[];
    stats: Stats;
    translate: (key: string, lang?: string) => string;
    selectedLanguage: string;
    selectedCurrency: string;
}

const TradingActivityAndStats: React.FC<TradingActivityAndStatsProps> = ({
    activities,
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

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString(selectedLanguage, {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Card className="bg-black rounded-2xl overflow-hidden border border-gray-800 max-w-[1200px] mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center justify-between">
                    <div className="flex items-center">
                        <Activity className="mr-2 h-6 w-6 text-[#BB86FC]" />
                        {translate(
                            'Trading Activity & Stats',
                            selectedLanguage
                        )}
                    </div>
                    <button className="text-[#BB86FC] hover:text-[#9D4EDD] transition-colors text-sm flex items-center">
                        {translate('View All', selectedLanguage)}
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">
                            {translate('Recent Trades', selectedLanguage)}
                        </h3>
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center justify-between bg-gray-900 p-3 rounded-lg"
                                >
                                    <div className="flex items-center">
                                        <div
                                            className={cn(
                                                'w-10 h-10 rounded-full flex items-center justify-center mr-3',
                                                activity.type === 'buy'
                                                    ? 'bg-green-400/20 text-green-400'
                                                    : 'bg-red-500/20 text-red-500'
                                            )}
                                        >
                                            {activity.type === 'buy' ? (
                                                <ArrowUpRight className="h-6 w-6" />
                                            ) : (
                                                <ArrowDownRight className="h-6 w-6" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {translate(
                                                    activity.product,
                                                    selectedLanguage
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {activity.type === 'buy'
                                                    ? translate(
                                                          'Bought',
                                                          selectedLanguage
                                                      )
                                                    : translate(
                                                          'Sold',
                                                          selectedLanguage
                                                      )}{' '}
                                                {activity.amount} @{' '}
                                                {formatCurrency(activity.price)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-white">
                                            {formatCurrency(
                                                activity.amount * activity.price
                                            )}
                                        </p>
                                        <p className="text-xs text-green-400">
                                            +{activity.decomEarned} DECOM
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {formatTime(activity.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">
                            {translate('Transaction Stats', selectedLanguage)}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard
                                title={translate(
                                    'Total Volume',
                                    selectedLanguage
                                )}
                                value={formatCurrency(stats.totalVolume)}
                                icon={
                                    <Activity className="h-5 w-5 text-[#BB86FC]" />
                                }
                            />
                            <StatCard
                                title={translate(
                                    'Transactions',
                                    selectedLanguage
                                )}
                                value={formatNumber(stats.transactions)}
                                icon={
                                    <TrendingUp className="h-5 w-5 text-[#BB86FC]" />
                                }
                            />
                            <StatCard
                                title={translate(
                                    'Average Price',
                                    selectedLanguage
                                )}
                                value={formatCurrency(stats.averagePrice)}
                                icon={
                                    <TrendingUp className="h-5 w-5 text-[#BB86FC]" />
                                }
                            />
                            <StatCard
                                title={translate(
                                    '24h Change',
                                    selectedLanguage
                                )}
                                value={`${stats.percentChange}%`}
                                icon={
                                    stats.percentChange >= 0 ? (
                                        <TrendingUp className="h-5 w-5 text-green-400" />
                                    ) : (
                                        <TrendingDown className="h-5 w-5 text-red-500" />
                                    )
                                }
                                valueColor={
                                    stats.percentChange >= 0
                                        ? 'text-green-400'
                                        : 'text-red-500'
                                }
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    valueColor = 'text-[#BB86FC]',
}) => (
    <div className="bg-gray-900 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">{title}</span>
            {icon}
        </div>
        <p className={cn('text-2xl font-bold', valueColor)}>{value}</p>
    </div>
);

export default TradingActivityAndStats;
