'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

interface NavLinkProps {
    href: string;
    children: any;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
    const { countryCode } = useParams();

    return (
        <Link
            style={{ padding: '0', margin: '0' }}
            href={`/${countryCode}${href}`}
        >
            {children}
        </Link>
    );
};

export default NavLink;
