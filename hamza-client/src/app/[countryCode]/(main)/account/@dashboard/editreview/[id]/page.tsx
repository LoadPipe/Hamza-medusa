import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { retrieveOrder } from '@/lib/server';
import EditReviewTemplate from '@modules/editreview/[id]/edit-review-template';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { XMark } from '@medusajs/icons';
import React from 'react';

type Props = {
    params: { id: string };
};

export default async function EditReviewPage({ params }: Props) {
    const order = await retrieveOrder(params.id).catch(() => null);

    return (
        <div className="w-full bg-black text-white p-8">
            <div className="mb-8 flex flex-col gap-y-4 justify-between items-center">
                <h1 className="text-2xl font-semibold">Edit Review</h1>

                {/* New wrapper div for horizontal alignment */}
                <div className="flex justify-between items-center w-full">
                    <p className="text-base">
                        Edit Rate and review of purchased product:
                    </p>
                    <LocalizedClientLink
                        href="/account/orders"
                        className="flex gap-2 items-center text-white hover:text-ui-fg-base"
                    >
                        <XMark /> Back to overview
                    </LocalizedClientLink>
                </div>
            </div>
            <div>
                <EditReviewTemplate />
            </div>
        </div>
    );
}
