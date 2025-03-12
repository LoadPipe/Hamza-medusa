'use server';

const ADMIN_CORS =
    process.env.NEXT_PUBLIC_ADMIN_CORS || 'http://localhost:7001';

import { revalidateTag } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { listRegions, updateCart } from '@/lib/server';

import { Region } from '@medusajs/medusa';

/**
 * Retrieves the region based on the countryCode path param
 */
export async function getRegion(countryCode: string) {
    try {
        const regions = await listRegions();
        // console.log(`REGIONS ARE ${JSON.stringify(regions)}`)

        if (!regions) {
            return null;
        }

        const regionMap = new Map<string, Region>();

        regions.forEach((region) => {
            region.countries.forEach((c) => {
                regionMap.set(c.iso_2, region);
            });
        });


        const region = countryCode
            ? regionMap.get(countryCode)
            : regionMap.get(process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en');

        return region;
    } catch (e: any) {
        console.log(e.toString());
        return null;
    }
}

/**
 * Updates the regionId cookie and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
    const cartId = cookies().get('_medusa_cart_id')?.value;
    const region = await getRegion(countryCode);

    if (!region) {
        return null;
    }

    try {
        if (cartId) {
            await updateCart(cartId, { region_id: region.id });
            revalidateTag('cart');
        }

        revalidateTag('regions');
        revalidateTag('products');
    } catch (e) {
        return 'Error updating region';
    }

    redirect(`/${countryCode}${currentPath}`);
}

export async function resetOnboardingState(orderId: string) {
    cookies().set('_medusa_onboarding', 'false', { maxAge: -1 });
    redirect(`${ADMIN_CORS}/a/orders/${orderId}`);
}
