import MedusaCTA from '@modules/layout/components/medusa-cta';
import React from 'react';
import Nav from '@modules/layout/templates/nav-v3';
import Footer from '@modules/layout/templates/footer';

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full bg-black relative small:min-h-screen py-8 justify-center">
            <Nav />
            <div className="relative">{children}</div>
            <div className="py-4 w-full flex items-center justify-center">
                <MedusaCTA />
            </div>
            <Footer />
        </div>
    );
}
