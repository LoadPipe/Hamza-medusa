import { ProductVariant } from '@medusajs/medusa';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

export type ProductHit = {
    id: string;
    title: string;
    handle: string;
    description: string | null;
    thumbnail: string | null;
    variants: ProductVariant[];
    collection_handle: string | null;
    collection_id: string | null;
};

type MobileHitProps = {
    hit: ProductHit;
    query: string;
};

const highlightText = (text: string, query: string) => {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="font-bold">$1</span>');
};

const MobileHit = ({ hit, query }: MobileHitProps) => {
    return (
        <LocalizedClientLink href={`/products/${hit.handle}`}>
            <div
                key={hit.id}
                className="bg-gray-900 rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-800 transition-colors"
            >
                <div className="flex flex-col justify-center w-full">
                    <span
                        className="text-white text-sm"
                        dangerouslySetInnerHTML={{
                            __html: highlightText(hit.title, query),
                        }}
                    />
                </div>
            </div>
        </LocalizedClientLink>
    );
};

export default MobileHit;
