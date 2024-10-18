import { Region } from '@medusajs/medusa';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';

//import { getPercentageDiff } from '@lib/util/get-precentage-diff';
//import { formatAmount } from '@lib/util/prices';
import { ProductPreviewType } from '@/types/global';
import { CalculatedVariant } from '@/types/medusa';

const transformProductPreview = (
    product: PricedProduct,
    region: Region
): ProductPreviewType => {
    const variants = product.variants as unknown as CalculatedVariant[];

    //is displayed on /store page
    return {
        id: product.id!,
        title: product.title!,
        handle: product.handle!,
        thumbnail: product.thumbnail!,
        created_at: product.created_at,
        prices:
            variants.length > 0
                ? variants[0].prices.map((a) => {
                      return {
                          currency_code: a.currency_code,
                          amount: a.amount,
                      };
                  })
                : [],
    };
};

export default transformProductPreview;
