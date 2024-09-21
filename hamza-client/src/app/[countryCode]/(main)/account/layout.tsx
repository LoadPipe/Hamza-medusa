import { getHamzaCustomer } from '@lib/data';
import AccountLayout from '@modules/account/templates/account-layout';

export default async function AccountPageLayout({
    dashboard,
    login,
}: {
    dashboard?: React.ReactNode;
    login?: React.ReactNode;
}) {
    const customer = await getHamzaCustomer().catch(() => null);

    return (
        <AccountLayout customer={customer}>
            {customer?.id ? dashboard : login}
        </AccountLayout>
    );
}
