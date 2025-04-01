'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import DOMPurify from 'dompurify';

const FreeScoutWidget = () => {
    const [sanitizedScript, setSanitizedScript] = useState<string>('');
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

    useEffect(() => {
        const sanitizeContent = async () => {
            if (typeof window !== 'undefined') {
                setSanitizedScript(DOMPurify.sanitize(scriptContent));
            }
        };

        sanitizeContent();
    }, []);

    if (!sanitizedScript) {
        return null;
    }

    return (
        <Script
            id="freescout-widget"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{ __html: sanitizedScript }}
        />
    );
};

export default FreeScoutWidget;
