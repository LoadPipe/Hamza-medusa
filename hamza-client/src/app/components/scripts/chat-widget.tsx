'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const FreeScoutWidget = () => {
    const [shouldLoadScript, setShouldLoadScript] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setShouldLoadScript(window.innerWidth > 480); // Adjust breakpoint as needed
        };

        checkScreenSize(); // Initial check
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    if (!shouldLoadScript) return null;

    return (
        <Script
            id="freescout-widget"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
                __html: `
                    window.FreeScoutW = {
                        s: {
                            "color": "#5ab334",
                            "position": "br",
                            "id": 2009307235
                        }
                    };
                    (function(d, e, s) {
                        if (d.getElementById("freescout-w")) return;
                        var a = d.createElement(e), m = d.getElementsByTagName(e)[0];
                        a.async = 1;
                        a.id = "freescout-w";
                        a.src = "https://support.hamza.market/modules/chat/js/widget.js?v=4239";
                        m.parentNode.insertBefore(a, m);
                    })(document, "script");
                `,
            }}
        />
    );
};

export default FreeScoutWidget;
