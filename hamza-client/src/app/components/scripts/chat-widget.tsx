'use client';

// import { useEffect, useState } from 'react';
import Script from 'next/script';
import DOMPurify from 'dompurify';

const FreeScoutWidget = () => {
    // const [shouldLoadScript, setShouldLoadScript] = useState(false);
    //
    // useEffect(() => {
    //     const checkScreenSize = () => {
    //         setShouldLoadScript(window.innerWidth > 480); // Adjust breakpoint as needed
    //     };
    //
    //     checkScreenSize(); // Initial check
    //     window.addEventListener('resize', checkScreenSize);
    //
    //     return () => {
    //         window.removeEventListener('resize', checkScreenSize);
    //     };
    // }, []);
    //
    // if (!shouldLoadScript) return null;

    const scriptContent = `
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
    `;

    // This is static and under our control, so we don't need to sanitize it, but why not lol
    const sanitizedScript = DOMPurify.sanitize(scriptContent);

    return (
        <Script
            id="freescout-widget"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{ __html: sanitizedScript }}
        />
    );
};

export default FreeScoutWidget;
