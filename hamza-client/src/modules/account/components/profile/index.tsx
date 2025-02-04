import { Flex } from '@chakra-ui/react';
import React from 'react';
import ProfileForm from './components/profile-form/profile-form';

interface ProfileProps {
    customer: any;
}

function Profile({ customer }: ProfileProps) {
    return (
        <Flex
            maxW={'927px'}
            width="100%"
            backgroundColor={'#121212'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            borderRadius={'12px'}
            p={'1.5rem'}
        >
            {/* Profile Form */}
            <ProfileForm customer={customer} />
        </Flex>
    );
}

export default Profile;
