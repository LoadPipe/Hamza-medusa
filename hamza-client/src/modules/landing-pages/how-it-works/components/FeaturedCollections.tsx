import type React from 'react';
import { ArrowRight } from 'lucide-react';
import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';

interface Collection {
    id: string;
    title: string;
    description: string;
    image: string;
}

interface FeaturedCollectionsProps {
    collections: Collection[];
    translate: (key: string, lang?: string) => string;
    selectedLanguage: string;
}

const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({
    collections,
    translate,
    selectedLanguage,
}) => {
    return (
        <div className="mt-16 max-w-[1200px] mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-bold text-white mb-8">
                {translate('Featured Collections', selectedLanguage)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                    <Card
                        key={collection.id}
                        className="bg-[#121212] rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        <div className="h-48 overflow-hidden">
                            <img
                                src={collection.image || '/placeholder.svg'}
                                alt={collection.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <CardContent className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {translate(collection.title, selectedLanguage)}
                            </h3>
                            <p className="text-gray-400 mb-4">
                                {translate(
                                    collection.description,
                                    selectedLanguage
                                )}
                            </p>
                            <button className="flex items-center text-[#BB86FC] hover:text-[#9D4EDD] transition-colors">
                                {translate('View All', selectedLanguage)}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FeaturedCollections;
