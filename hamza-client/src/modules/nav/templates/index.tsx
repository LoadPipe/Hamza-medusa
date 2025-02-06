import React from 'react';

import Footer from '@/modules/nav/templates/footer';
import Nav from './nav';

const Layout: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    return (
        <div>
            <Nav />
            <main className="relative">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
