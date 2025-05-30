import { Text } from '@medusajs/ui';

import { ProductPreviewType } from '@/types/global';

import { retrievePricedProductById } from '@/lib/server';
import { getProductPrice } from '@lib/util/get-product-price';
import { Region } from '@medusajs/medusa';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Thumbnail from '../thumbnail';
import PreviewPrice from './components/preview-price';

export default async function ProductPreview({
    productPreview,
    isFeatured,
    region,
}: {
    productPreview: ProductPreviewType;
    isFeatured?: boolean;
    region: Region;
}) {
    // const pricedProduct = await retrievePricedProductById({
    //   id: productPreview.id,
    //   regionId: region.id,
    // }).then((product) => product)

    // if (!pricedProduct) {
    //   return null
    // }

    return (
        <LocalizedClientLink
            href={`/products/${productPreview.handle}`}
            className="group"
        >
            <div>
                <Thumbnail
                    thumbnail={productPreview.thumbnail}
                    size="full"
                    isFeatured={isFeatured}
                />

                <div className="flex txt-compact-medium mt-4 justify-between">
                    <Text className="text-ui-fg-subtle font-bold text-white ">
                        {productPreview.title}
                    </Text>
                    <div className="flex items-center gap-x-2 ">
                        <PreviewPrice prices={productPreview.prices || []} />
                    </div>
                </div>
            </div>
        </LocalizedClientLink>
    );
}
