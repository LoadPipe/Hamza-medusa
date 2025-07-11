import type React from 'react';
import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { ArrowRight, Activity } from 'lucide-react';

interface TradeActivity {
    id: string;
    type: 'buy' | 'sell';
    product: string;
    amount: number;
    price: number;
    timestamp: string;
}

interface TradingActivityFeedProps {
    activities: TradeActivity[];
    translate: (key: string, lang?: string) => string;
    selectedLanguage: string;
    selectedCurrency: string;
}

const TradingActivityFeed: React.FC<TradingActivityFeedProps> = ({
    activities,
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

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString(selectedLanguage, {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="mt-16 max-w-[1200px] mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                    <Activity className="mr-2 h-8 w-8 text-[#BB86FC]" />
                    {translate('Trading Activity', selectedLanguage)}
                </h2>
                <button className="text-[#BB86FC] hover:text-[#9D4EDD] transition-colors flex items-center">
                    {translate('View All Activity', selectedLanguage)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </button>
            </div>
            <Card className="bg-[#121212] rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`w-2 h-2 rounded-full mr-3 ${activity.type === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}
                                    ></div>
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
                                    <p className="text-xs text-gray-400">
                                        {formatTime(activity.timestamp)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TradingActivityFeed;
