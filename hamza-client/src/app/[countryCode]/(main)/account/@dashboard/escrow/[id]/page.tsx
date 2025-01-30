import { Metadata } from 'next';
import { Flex } from '@chakra-ui/react';

import { Escrow } from "@/modules/order/templates/escrow";
import { headers } from 'next/headers';
import { getHamzaCustomer } from '@lib/data';
import { getRegion } from '@/app/actions';
import { notFound } from 'next/navigation';

type Props = {
	params: { id: string };
};

export const metadata: Metadata = {
	title: 'Order Escrow',
	description: 'View your Order Escrow',
};

export default async function EscrowPage({
	params,
}: Props) {
	const nextHeaders = headers();
	const countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY
		? process.env.NEXT_PUBLIC_FORCE_COUNTRY
		: nextHeaders.get('next-url')?.split('/')[1] || '';
	const customer = await getHamzaCustomer();
	const region = await getRegion(countryCode);

	if (!customer || !region) {
		notFound();
	}
	// TODO: move the customer / order check here, pass as props


	return (
		<>
			<Escrow />
		</>
	);
}