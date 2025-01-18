import { Escrow } from "@/modules/order/templates/escrow";

type Props = {
	params: { id: string };
};

export default async function EscrowPage({
	params,
}: Props) {
	return (
		<>
			<Escrow />
		</>
	);
}