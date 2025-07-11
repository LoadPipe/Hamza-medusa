import type React from 'react';
import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { ArrowRight, TrendingUp, Eye } from 'lucide-react';

interface Collection {
    id: string;
    name: string;
    image: string;
    volume: number;
    change: number;
    floorPrice: number;
}

interface TrendingCollectionsProps {
    collections: Collection[];
    translate: (key: string, lang?: string) => string;
    selectedLanguage: string;
    selectedCurrency: string;
}

const TrendingCollections: React.FC<TrendingCollectionsProps> = ({
    collections,
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
        <div className="mt-16 max-w-[1400px] mx-auto px-4 relative z-10">
            {' '}
            {/* Updated max-width */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                    <TrendingUp className="mr-2 h-8 w-8 text-green-400" />
                    {translate('Trending Collections', selectedLanguage)}
                </h2>
                <button className="text-purple-500 hover:text-purple-400 transition-colors flex items-center">
                    {translate('View All', selectedLanguage)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {collections.map((collection) => (
                    <Card
                        key={collection.id}
                        className="bg-black rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-800"
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={collection.image || '/placeholder.svg'}
                                alt={collection.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {translate(
                                        collection.name,
                                        selectedLanguage
                                    )}
                                </h3>
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">
                                    {translate('Volume', selectedLanguage)}
                                </span>
                                <span className="text-sm font-medium text-white">
                                    {formatCurrency(collection.volume)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">
                                    {translate('Change', selectedLanguage)}
                                </span>
                                <span
                                    className={`text-sm font-medium ${collection.change >= 0 ? 'text-green-400' : 'text-red-500'}`}
                                >
                                    {collection.change >= 0 ? '+' : ''}
                                    {collection.change}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">
                                    {translate('Floor Price', selectedLanguage)}
                                </span>
                                <span className="text-sm font-medium text-white">
                                    {formatCurrency(collection.floorPrice)}
                                </span>
                            </div>
                            <button className="mt-4 w-full bg-purple-500 text-white font-medium py-2 rounded-full hover:bg-purple-400 transition-colors flex items-center justify-center">
                                <Eye className="mr-2 h-4 w-4" />
                                {translate('View Collection', selectedLanguage)}
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TrendingCollections;
