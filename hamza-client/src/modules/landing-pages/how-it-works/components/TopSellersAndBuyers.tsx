'use client';

import type React from 'react';

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@modules/landing-pages/how-it-works/components/ui/table';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@modules/landing-pages/how-it-works/components/ui/tabs';
import {
    Star,
    TrendingUp,
    ShoppingBag,
    ArrowUpRight,
    ArrowDownRight,
    ArrowRight,
    Activity,
} from 'lucide-react';

interface Seller {
    id: string;
    name: string;
    image: string;
    sales: number;
    rating: number;
    reviews: number;
    decomEarned: number;
    trend: 'up' | 'down' | 'neutral';
    lastActive: string;
}

interface Buyer {
    id: string;
    name: string;
    image: string;
    purchases: number;
    totalSpent: number;
    decomSpent: number;
    trend: 'up' | 'down' | 'neutral';
    lastPurchase: string;
}

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

interface TopSellersAndBuyersProps {
    sellers: Seller[];
    buyers: Buyer[];
    activities: TradeActivity[];
    stats: Stats;
    translate: (key: string, lang?: string) => string;
    selectedLanguage: string;
    selectedCurrency: string;
}

const TopSellersAndBuyers: React.FC<TopSellersAndBuyersProps> = ({
    sellers,
    buyers,
    activities,
    stats,
    translate,
    selectedLanguage,
    selectedCurrency,
}) => {
    const [activeTab, setActiveTab] = useState('sellers');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(selectedLanguage, {
            style: 'currency',
            currency: selectedCurrency,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
        return num.toFixed(1);
    };

    const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
        switch (trend) {
            case 'up':
                return <ArrowUpRight className="h-4 w-4 text-[#94D42A]" />;
            case 'down':
                return <ArrowDownRight className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString(selectedLanguage, {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatsForTab = () => {
        const commonStats = [
            {
                label: 'Total Volume',
                value: formatCurrency(stats.totalVolume),
                change: '+12.5%',
                trend: 'up' as const,
            },
            {
                label: 'Average Price',
                value: formatCurrency(stats.averagePrice),
                change: '+8.3%',
                trend: 'up' as const,
            },
        ];

        switch (activeTab) {
            case 'sellers':
                return [
                    {
                        label: 'Total Sellers',
                        value: formatNumber(sellers.length),
                        change: '+5.2%',
                        trend: 'up' as const,
                    },
                    {
                        label: 'Top Sales',
                        value: formatCurrency(sellers[0]?.sales || 0),
                        change: '+15.8%',
                        trend: 'up' as const,
                    },
                    ...commonStats,
                ];
            case 'buyers':
                return [
                    {
                        label: 'Total Buyers',
                        value: formatNumber(buyers.length),
                        change: '+7.4%',
                        trend: 'up' as const,
                    },
                    {
                        label: 'Top Spent',
                        value: formatCurrency(buyers[0]?.totalSpent || 0),
                        change: '+9.2%',
                        trend: 'up' as const,
                    },
                    ...commonStats,
                ];
            case 'activity':
                return [
                    {
                        label: 'Transactions',
                        value: formatNumber(activities.length),
                        change: '+3.7%',
                        trend: 'up' as const,
                    },
                    {
                        label: 'Success Rate',
                        value: '98.5%',
                        change: '+2.1%',
                        trend: 'up' as const,
                    },
                    ...commonStats,
                ];
        }
    };

    return (
        <Card className="bg-[#121212] border-gray-800">
            <CardHeader className="border-b border-gray-800">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-medium text-white flex items-center">
                        {activeTab === 'sellers' && (
                            <TrendingUp className="mr-2 h-5 w-5 text-[#94D42A]" />
                        )}
                        {activeTab === 'buyers' && (
                            <ShoppingBag className="mr-2 h-5 w-5 text-[#94D42A]" />
                        )}
                        {activeTab === 'activity' && (
                            <Activity className="mr-2 h-5 w-5 text-[#94D42A]" />
                        )}
                        {translate(
                            activeTab === 'sellers'
                                ? 'Top Sellers'
                                : activeTab === 'buyers'
                                  ? 'Top Buyers'
                                  : 'Trading Activity',
                            selectedLanguage
                        )}
                    </CardTitle>
                    <div className="flex items-center gap-4">
                        <button className="text-[#94D42A] hover:text-[#7AB322] transition-colors text-sm flex items-center">
                            {translate('View All', selectedLanguage)}
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <Tabs
                    defaultValue="sellers"
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-3 mb-6 bg-[#1a1a1a] p-1 rounded-lg">
                        <TabsTrigger
                            value="sellers"
                            className="data-[state=active]:bg-[#94D42A] data-[state=active]:text-black rounded-md"
                        >
                            {translate('Sellers', selectedLanguage)}
                        </TabsTrigger>
                        <TabsTrigger
                            value="buyers"
                            className="data-[state=active]:bg-[#94D42A] data-[state=active]:text-black rounded-md"
                        >
                            {translate('Buyers', selectedLanguage)}
                        </TabsTrigger>
                        <TabsTrigger
                            value="activity"
                            className="data-[state=active]:bg-[#94D42A] data-[state=active]:text-black rounded-md"
                        >
                            {translate('Activity', selectedLanguage)}
                        </TabsTrigger>
                    </TabsList>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        {getStatsForTab()?.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-[#1a1a1a] rounded-lg p-4"
                            >
                                <div className="text-sm text-gray-400 mb-1">
                                    {translate(stat.label, selectedLanguage)}
                                </div>
                                <div className="text-lg font-medium text-white">
                                    {stat.value}
                                </div>
                                <div
                                    className={`text-xs ${stat.trend === 'up' ? 'text-[#94D42A]' : 'text-red-500'} flex items-center`}
                                >
                                    {stat.trend === 'up' ? (
                                        <ArrowUpRight className="h-3 w-3 mr-1" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 mr-1" />
                                    )}
                                    {stat.change}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#1a1a1a] rounded-lg p-4">
                        <TabsContent value="sellers">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-800">
                                        <TableHead className="text-gray-400">
                                            Rank
                                        </TableHead>
                                        <TableHead className="text-gray-400">
                                            Seller
                                        </TableHead>
                                        <TableHead className="text-gray-400">
                                            Sales
                                        </TableHead>
                                        <TableHead className="text-gray-400">
                                            DECOM Earned
                                        </TableHead>
                                        <TableHead className="text-gray-400">
                                            Last Active
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sellers
                                        .slice(0, 5)
                                        .map((seller, index) => (
                                            <TableRow
                                                key={seller.id}
                                                className="border-gray-800"
                                            >
                                                <TableCell className="text-white font-medium">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <img
                                                            src={
                                                                seller.image ||
                                                                '/placeholder.svg'
                                                            }
                                                            alt={seller.name}
                                                            className="w-8 h-8 rounded-full mr-2"
                                                        />
                                                        <div>
                                                            <div className="text-sm font-medium text-white">
                                                                {seller.name}
                                                            </div>
                                                            <div className="flex items-center text-xs text-gray-400">
                                                                <Star className="h-3 w-3 text-yellow-400 mr-1" />
                                                                {seller.rating}{' '}
                                                                (
                                                                {formatNumber(
                                                                    seller.reviews
                                                                )}
                                                                )
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <span className="text-white mr-1">
                                                            {formatCurrency(
                                                                seller.sales
                                                            )}
                                                        </span>
                                                        {getTrendIcon(
                                                            seller.trend
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <span className="text-[#94D42A] mr-1">
                                                            {formatNumber(
                                                                seller.decomEarned
                                                            ).replace('$', '')}
                                                            K DECOM
                                                        </span>
                                                        {getTrendIcon(
                                                            seller.trend
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-400">
                                                    {formatTime(
                                                        seller.lastActive
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        <TabsContent value="buyers">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-800">
                                        <TableHead className="text-gray-400">
                                            Rank
                                        </TableHead>
                                        <TableHead className="text-gray-400">
                                            Buyer
                                        </TableHead>
                                        <TableHead className="text-gray-400">
                                            Purchases
                                        </TableHead>
                                        <TableHead className="text-gray-400">
                                            Total Spent
                                        </TableHead>
                                        <TableHead className="text-gray-400">
                                            Last Purchase
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {buyers.slice(0, 5).map((buyer, index) => (
                                        <TableRow
                                            key={buyer.id}
                                            className="border-gray-800"
                                        >
                                            <TableCell className="text-white font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <img
                                                        src={
                                                            buyer.image ||
                                                            '/placeholder.svg'
                                                        }
                                                        alt={buyer.name}
                                                        className="w-8 h-8 rounded-full mr-2"
                                                    />
                                                    <div className="text-sm font-medium text-white">
                                                        {buyer.name}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <span className="text-white mr-1">
                                                        {formatNumber(
                                                            buyer.purchases
                                                        )}
                                                    </span>
                                                    {getTrendIcon(buyer.trend)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center">
                                                        <span className="text-white mr-1">
                                                            {formatCurrency(
                                                                buyer.totalSpent
                                                            )}
                                                        </span>
                                                        {getTrendIcon(
                                                            buyer.trend
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-[#94D42A]">
                                                        {formatNumber(
                                                            buyer.decomSpent
                                                        ).replace('$', '')}
                                                        K DECOM
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-400">
                                                {formatTime(buyer.lastPurchase)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        <TabsContent value="activity">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-800">
                                        <TableHead className="text-gray-400">
                                            Type
                                        </TableHead>
                                        <TableHead className="text-gray-400">
                                            Product
                                        </TableHead>
                                        <TableHead className="text-gray-400">
                                            Amount
                                        </TableHead>
                                        <TableHead className="text-gray-400">
                                            Price
                                        </TableHead>
                                        <TableHead className="text-gray-400">
                                            DECOM Earned
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {activities.slice(0, 5).map((activity) => (
                                        <TableRow
                                            key={activity.id}
                                            className="border-gray-800"
                                        >
                                            <TableCell>
                                                <div
                                                    className={`flex items-center ${activity.type === 'buy' ? 'text-[#94D42A]' : 'text-red-500'}`}
                                                >
                                                    {activity.type === 'buy' ? (
                                                        <ArrowUpRight className="h-4 w-4 mr-1" />
                                                    ) : (
                                                        <ArrowDownRight className="h-4 w-4 mr-1" />
                                                    )}
                                                    {translate(
                                                        activity.type === 'buy'
                                                            ? 'Bought'
                                                            : 'Sold',
                                                        selectedLanguage
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-white">
                                                {translate(
                                                    activity.product,
                                                    selectedLanguage
                                                )}
                                            </TableCell>
                                            <TableCell className="text-white">
                                                {activity.amount}
                                            </TableCell>
                                            <TableCell className="text-white">
                                                {formatCurrency(activity.price)}
                                            </TableCell>
                                            <TableCell className="text-[#94D42A]">
                                                +{activity.decomEarned} DECOM
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default TopSellersAndBuyers;
