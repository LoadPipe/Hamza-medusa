'use client';

import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { Button } from '@modules/landing-pages/how-it-works/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@modules/landing-pages/how-it-works/lib/utils';

interface DECOMInfoProps {
    userTokens: number;
    userLevel: number;
    totalSupply: number;
    circulatingSupply: number;
    price: number;
    userRank: number;
    nextLevelTokens: number;
    translate: (key: string, lang?: string) => string;
    selectedLanguage: string;
    selectedCurrency: string;
    currentDecomPrice: number;
    totalUsers: number;
    marketCap: number;
}

// Generate mock price data for mini chart
const generatePriceData = (points: number, trend: 'up' | 'down' = 'up') => {
    const data = [];
    let price = 100;
    for (let i = 0; i < points; i++) {
        price =
            price * (1 + (trend === 'up' ? 0.1 : -0.1) * (Math.random() - 0.5));
        data.push({ price });
    }
    return data;
};

export default function DECOMInfo({
    userTokens,
    userLevel,
    totalSupply,
    circulatingSupply,
    price,
    userRank,
    nextLevelTokens,
    translate,
    selectedLanguage,
    selectedCurrency,
    currentDecomPrice,
    totalUsers,
    marketCap,
}: DECOMInfoProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(selectedLanguage, {
            style: 'currency',
            currency: selectedCurrency,
            notation: 'compact',
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat(selectedLanguage, {
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(num);
    };

    const formatPercentage = (value: number) => {
        return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
    };

    const priceChange24h = 2.5;
    const priceChange7d = 5.8;
    const volumeChange24h = 3.2;

    return (
        <Card className="bg-black border-gray-800">
            <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-center">
                    {/* DECOM Price Section */}
                    <div className="flex-shrink-0 flex items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-lg font-bold text-white">
                                    DECOM
                                </h2>
                                <span className="text-sm text-gray-400">
                                    $DECOM
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-white">
                                    {formatCurrency(currentDecomPrice)}
                                </span>
                                <span
                                    className={cn(
                                        'text-sm flex items-center gap-0.5',
                                        priceChange24h >= 0
                                            ? 'text-green-400'
                                            : 'text-red-400'
                                    )}
                                >
                                    {priceChange24h >= 0 ? (
                                        <ChevronUp className="w-3 h-3" />
                                    ) : (
                                        <ChevronDown className="w-3 h-3" />
                                    )}
                                    {formatPercentage(priceChange24h)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden lg:block w-px h-12 bg-gray-800" />

                    {/* Market Stats */}
                    <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                        <div>
                            <div className="text-sm text-gray-400 mb-1">
                                Market Cap
                            </div>
                            <div className="text-white font-medium">
                                {formatCurrency(marketCap)}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-400 mb-1">
                                24h Volume
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-white font-medium">
                                    {formatCurrency(marketCap * 0.1)}
                                </span>
                                <span
                                    className={cn(
                                        'text-xs',
                                        volumeChange24h >= 0
                                            ? 'text-green-400'
                                            : 'text-red-400'
                                    )}
                                >
                                    {formatPercentage(volumeChange24h)}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-400 mb-1">
                                Circulating Supply
                            </div>
                            <div className="text-white font-medium">
                                {formatNumber(circulatingSupply)} DECOM
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-400 mb-1">
                                Total Users
                            </div>
                            <div className="text-white font-medium">
                                {formatNumber(totalUsers)}
                            </div>
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden lg:block w-px h-12 bg-gray-800" />

                    {/* User Stats */}
                    <div className="flex-shrink-0 flex items-center gap-6">
                        <div>
                            <div className="text-sm text-gray-400 mb-1">
                                Your Balance
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-medium">
                                    {formatNumber(userTokens)} DECOM
                                </span>
                                <div className="text-lg">
                                    {userLevel < 5
                                        ? '🥉'
                                        : userLevel < 10
                                          ? '🥈'
                                          : userLevel < 15
                                            ? '🥇'
                                            : '💎'}
                                </div>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            className="bg-green-400 text-black hover:bg-green-500"
                        >
                            Buy DECOM
                        </Button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span>Progress to Level {userLevel + 1}</span>
                        <span>
                            {formatNumber(userTokens)} /{' '}
                            {formatNumber(nextLevelTokens)} DECOM
                        </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-green-500"
                            initial={{ width: 0 }}
                            animate={{
                                width: `${(userTokens / nextLevelTokens) * 100}%`,
                            }}
                            transition={{ duration: 1, ease: 'easeInOut' }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
