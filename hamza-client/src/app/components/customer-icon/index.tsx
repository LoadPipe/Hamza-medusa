import { getHamzaCustomer } from '@lib/data';
import ProfileImage from '@/components/customer-icon/profile-image';

export default async function ProfilePage() {
    const customerId = await getHamzaCustomer();

    return (
        <div>
            <h1>Customer Profile Page</h1>
            {/* Pass customerId as a prop to the client-side component */}
            <ProfileImage customerId={customerId.id} />
        </div>
    );
}
