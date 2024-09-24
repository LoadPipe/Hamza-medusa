'use client';

import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { verifyToken } from '@lib/data/index';

const VerifyEmail = () => {
    const [status, setStatus] = useState(
        ''
    );
    const [message, setMessage] = useState(
        ''
    );
    const router = useRouter();
    const { token } = useParams();
    const { setCustomerAuthData, authData } = useCustomerAuthStore();

    useEffect(() => {
        const confirmationTokenHandler = async () => {
            if (status != 'ok') {
                let res: any = await verifyToken(token as string);
                if (res.status) {
                    toast.success('Email verified successfully!');
                    setCustomerAuthData({ ...authData, is_verified: true });

                    setTimeout(() => {
                        router.push('/account/');
                    }, 3000);
                    return;
                } else {
                    toast.error(res?.message);
                    return;
                }
            }
        };
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
