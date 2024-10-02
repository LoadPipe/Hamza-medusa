'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

/**
 * Use this components to create a Next.js `<Link />` that persists the current country code in the url,
 * without having to explicitly pass it as a prop.
 */
const LocalizedClientLink = ({
    children,
    href,
    ...props
}: {
    children?: React.ReactNode;
    href?: string;
    className?: string;
    onClick?: () => void;
    passHref?: true;
    [x: string]: any;
}) => {
    const { countryCode } = useParams();
    const router = useRouter();
    const baseURL =
        process.env.NEXT_PUBLIC_MEDUSA_CLIENT_URL || 'http://localhost:8000';
    // default fallback path should go to homepage just incase they load website on child page...
    const fallbackPath = countryCode ? `${baseURL}/${countryCode}` : baseURL;

    const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        e.preventDefault(); // Prevent default anchor behavior

        // If href is provided, navigate to it. Otherwise, go back one step in history
        if (href) {
            router.push(`/${countryCode}${href}`);
        } else if (window.history.length > 1) {
            router.back();
        } else {
            router.push(fallbackPath); // Navigate to fallback path if no history exists
        }
    };

    return (
        <a
            href={href ? `/${countryCode}${href}` : '#'}
            onClick={handleClick}
            {...props}
        >
            {children}
        </a>
    );
};

export default LocalizedClientLink;
