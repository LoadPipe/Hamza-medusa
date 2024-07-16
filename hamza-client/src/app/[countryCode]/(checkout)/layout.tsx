import MedusaCTA from '@modules/layout/components/medusa-cta';
import React from 'react';
<<<<<<< HEAD
import Nav from '@modules/layout/templates/nav-4';
=======
import Nav from 'modules/layout/templates/nav';
>>>>>>> staging
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
