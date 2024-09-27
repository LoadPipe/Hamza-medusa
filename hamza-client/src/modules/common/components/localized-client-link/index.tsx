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

    const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        e.preventDefault(); // Prevent default anchor behavior

        // If href is provided, navigate to it. Otherwise, go back one step in history
        if (href) {
            router.push(`/${countryCode}${href}`);
        } else {
            router.back();
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
