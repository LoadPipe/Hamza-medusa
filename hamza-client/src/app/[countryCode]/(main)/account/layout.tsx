import { getHamzaCustomer } from '@lib/data';
import AccountLayout from '@modules/account/templates/account-layout';
import Login from './@login/page';
/*
   @Author - Garo Nazarian
   @Date of Documentation DOD - Sep 27, 2024
   This layout checks if the user is logged in (customer?.id) and then conditionally renders
   the dashboard or login page.
   login: If the customer is not logged in, it SHOULD render the login page passed from @login/page.tsx
   which at this point in time is @login/page.tsx => Attach thy purse to yon
   But it doesn't so we're calling it in the beginning for now

   TODO: this AccountLayout needs some heavy refactoring - it's a mess, can't be done until after launch unfortunately, there's no time for it.
 */

export default async function AccountPageLayout({
    dashboard,
    login,
}: {
    dashboard?: React.ReactNode;
    login?: React.ReactNode;
}) {
    const customer = await getHamzaCustomer().catch(() => null);

    // console.log(`CUSTOMER??? ${JSON.stringify(customer.id)}`);

    if (customer.id === null || customer.id === undefined) {
        // console.log('CUSTOMER IS NULL show yonder page...');
        return <Login />;
    }

    return (
        <AccountLayout customer={customer}>
            {customer.id ? dashboard : login}
        </AccountLayout>
    );
}
