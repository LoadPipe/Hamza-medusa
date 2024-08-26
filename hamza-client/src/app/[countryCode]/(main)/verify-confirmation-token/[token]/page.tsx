'use client';

import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import Input from '@modules/common/components/input';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Toast } from '@medusajs/ui';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

const VerifyEmail = () => {
    const [message, setDisplayMessage] = useState(
        'loading results, Please wait!!!!'
    );
    const router = useRouter();
    const { token } = useParams();
    const { setCustomerAuthData, authData } = useCustomerAuthStore();

    const confirmationTokenHandler = async () => {
        //TODO: MOVE TO INDEX.TS
        let res = await axios.get(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/custom/confirmation-token/verify?token=${token}`
        );

        let data = res.data;
        if (data.status == true) {
            setDisplayMessage('Email verified successfully!!!');
            setCustomerAuthData({ ...authData, is_verified: true });
            return;
        } else {
            setDisplayMessage(data.message);
            return;
        }
    };

    useEffect(() => {
        confirmationTokenHandler();
    }, []);

    return (
        <div className="layout-base bg-black flex justify-center min-h-screen">
            <div className="flex flex-col items-center w-full">
                <div className="my-8">
                    <h1 className="font-semibold text-4xl text-white text-center">
                        Email Verification Status
                    </h1>
                </div>
                <div className="px-16">
                    <div className="p-4 md:p-5">
                        <span className="text-white">{message}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
