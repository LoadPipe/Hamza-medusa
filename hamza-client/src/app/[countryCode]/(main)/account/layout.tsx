import { getHamzaCustomer } from '@lib/data';
import AccountLayout from '@modules/account/templates/account-layout';
import { Flex, Text } from '@chakra-ui/react';
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
            {customer ? (
                dashboard
            ) : (
                <>
                    <Flex>
                        <Text color="white">
                            Connect your wallet to sign in and verify your
                            account.
                        </Text>
                    </Flex>
                </>
            )}
        </AccountLayout>
    );
}
