'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const FreeScoutWidget = () => {
    const [sanitizedScript, setSanitizedScript] = useState<string>('');
    const scriptContent = `(function(w,d,s,o,f,js,fjs){
        w['FreeScoutWidgetObject']=o;w[o]=w[o]||function(){
        (w[o].q=w[o].q||[]).push(arguments)};
        js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
        js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
    }(window,document,'script','fs'));`;

    useEffect(() => {
        const sanitizeContent = async () => {
            if (typeof window !== 'undefined') {
                const DOMPurify = (await import('dompurify')).default;
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
