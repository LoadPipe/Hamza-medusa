import type React from 'react';
import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { ArrowRight, Clock } from 'lucide-react';

interface Auction {
    id: string;
    name: string;
    image: string;
    currentBid: number;
    endTime: string;
}

interface LiveAuctionsProps {
    auctions: Auction[];
    translate: (key: string, lang?: string) => string;
    selectedLanguage: string;
    selectedCurrency: string;
}

const LiveAuctions: React.FC<LiveAuctionsProps> = ({
    auctions,
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

    const formatTimeLeft = (endTime: string) => {
        const end = new Date(endTime).getTime();
        const now = new Date().getTime();
        const diff = end - now;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="mt-16 max-w-[1200px] mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                    <Clock className="mr-2 h-8 w-8 text-green-400" />
                    {translate('Live Auctions', selectedLanguage)}
                </h2>
                <button className="text-purple-500 hover:text-purple-400 transition-colors flex items-center">
                    {translate('View All', selectedLanguage)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {auctions.map((auction) => (
                    <Card
                        key={auction.id}
                        className="bg-black rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-800"
                    >
                        <div className="h-48 overflow-hidden">
                            <img
                                src={auction.image || '/placeholder.svg'}
                                alt={auction.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <CardContent className="p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">
                                {translate(auction.name, selectedLanguage)}
                            </h3>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">
                                    {translate('Current Bid', selectedLanguage)}
                                </span>
                                <span className="text-sm font-medium text-white">
                                    {formatCurrency(auction.currentBid)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">
                                    {translate('Ends in', selectedLanguage)}
                                </span>
                                <span className="text-sm font-medium text-green-400">
                                    {formatTimeLeft(auction.endTime)}
                                </span>
                            </div>
                            <button className="mt-4 w-full bg-purple-500 text-white font-medium py-2 rounded-full hover:bg-purple-400 transition-colors">
                                {translate('Place Bid', selectedLanguage)}
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default LiveAuctions;
