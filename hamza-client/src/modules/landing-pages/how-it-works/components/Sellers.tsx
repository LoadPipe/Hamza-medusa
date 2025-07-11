'use client';

import type React from 'react';
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
import { Star, TrendingUp, ShoppingBag } from 'lucide-react';

interface Seller {
    id: string;
    name: string;
    image: string;
    sales: number;
    rating: number;
    reviews: number;
    decomEarned: number;
}

interface Buyer {
    id: string;
    name: string;
    image: string;
    purchases: number;
    totalSpent: number;
    decomSpent: number;
}

interface SellersProps {
    sellers: Seller[];
    buyers: Buyer[];
    translate: (key: string, lang?: string) => string;
    selectedLanguage: string;
    selectedCurrency: string;
}

const Sellers: React.FC<SellersProps> = ({
    sellers,
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-black border border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-white flex items-center">
                            <TrendingUp className="mr-2 h-6 w-6 text-green-400" />
                            {translate('Top Sellers', selectedLanguage)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-white">
                                        Rank
                                    </TableHead>
                                    <TableHead className="text-white">
                                        Seller
                                    </TableHead>
                                    <TableHead className="text-white">
                                        Sales
                                    </TableHead>
                                    <TableHead className="text-white">
                                        DECOM Earned
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sellers.slice(0, 10).map((seller, index) => (
                                    <TableRow key={seller.id}>
                                        <TableCell className="text-white font-medium">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <img
                                                    src={
                                                        seller.image ||
                                                        '/placeholder.svg?height=40&width=40'
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
                                                        {seller.rating} (
                                                        {formatNumber(
                                                            seller.reviews
                                                        )}
                                                        )
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-white">
                                            {formatCurrency(seller.sales)}
                                        </TableCell>
                                        <TableCell className="text-green-400">
                                            {formatNumber(seller.decomEarned)}{' '}
                                            DECOM
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="bg-black border border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-white flex items-center">
                            <ShoppingBag className="mr-2 h-6 w-6 text-purple-400" />
                            {translate('Top Buyers', selectedLanguage)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-white">
                                        Rank
                                    </TableHead>
                                    <TableHead className="text-white">
                                        Buyer
                                    </TableHead>
                                    <TableHead className="text-white">
                                        Purchases
                                    </TableHead>
                                    <TableHead className="text-white">
                                        Total Spent
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {buyers.slice(0, 10).map((buyer, index) => (
                                    <TableRow key={buyer.id}>
                                        <TableCell className="text-white font-medium">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <img
                                                    src={
                                                        buyer.image ||
                                                        '/placeholder.svg?height=40&width=40'
                                                    }
                                                    alt={buyer.name}
                                                    className="w-8 h-8 rounded-full mr-2"
                                                />
                                                <div className="text-sm font-medium text-white">
                                                    {buyer.name}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-white">
                                            {formatNumber(buyer.purchases)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-white">
                                                {formatCurrency(
                                                    buyer.totalSpent
                                                )}
                                            </div>
                                            <div className="text-xs text-purple-400">
                                                {formatNumber(buyer.decomSpent)}{' '}
                                                DECOM
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Sellers;
