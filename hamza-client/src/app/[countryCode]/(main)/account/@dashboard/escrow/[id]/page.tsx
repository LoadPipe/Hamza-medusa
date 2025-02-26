import { Metadata } from 'next';
import { Escrow } from '@/modules/order/templates/escrow';
import { headers } from 'next/headers';
import { getCustomerOrder, getHamzaCustomer } from '@/lib/server';
import { getRegion } from '@/app/actions';
import { notFound } from 'next/navigation';

type Props = {
    params: { id: string };
};

export const metadata: Metadata = {
    title: 'Order Escrow',
    description: 'View your Order Escrow',
};

//This could be refactored to hydration boundries with prefetching
//Logic and UI should be split
export default async function EscrowPage({ params }: Props) {
    const nextHeaders = headers();
    const countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY
        ? process.env.NEXT_PUBLIC_FORCE_COUNTRY
        : nextHeaders.get('next-url')?.split('/')[1] || '';

    // const currentChainId = await useChainId();
    // const { switchChain } = await useSwitchChain();
    const customer = await getHamzaCustomer();
    const order = await getCustomerOrder(customer.id, params.id);
    const region = await getRegion(countryCode);

    if (!customer || !region || !order) {
        notFound();
    }

    return (
        <>
            <Escrow order={order} />
        </>
    );
}
