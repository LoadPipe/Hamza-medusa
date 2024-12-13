async function main() {
    const port = 9000;
    try {
        const authResponse = await fetch(
            `http://localhost:${port}/admin/auth`,
            {
                method: 'POST',
                body: JSON.stringify({
                    email: 'admin@medusa-test.com',
                    password: 'supersecret',
                }),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            }
        );
        const authData = await authResponse.json();
        const authCookie = authResponse.headers.get('set-cookie');

        console.log(authData);

        const miscSetup = await fetch(
            `http://localhost:${port}/admin/custom/setup`,
            {
                method: 'POST',
                headers: {
                    Cookie: authCookie.substring(0, authCookie.indexOf(';')),
                },
            }
        );
        console.log(await miscSetup.json());

        const storeResponse = await fetch(
            `http://localhost:${port}/admin/custom/setup/user`,
            {
                method: 'POST',
                headers: {
                    Cookie: authCookie.substring(0, authCookie.indexOf(';')),
                },
                body: JSON.stringify({
                    email: 'goblinvendor@hamza.com',
                    password: 'password',
                }),
            }
        );
        console.log(await storeResponse.json());

        /*
        //await fetch(`http://localhost:${port}/admin/custom/massmarket`, {
        //    method: 'GET',
        //    headers: {
        //        Cookie: authCookie.substring(0, authCookie.indexOf(';')),
        //    },
        //});

        const buckySetupResponse = await fetch(
            `http://localhost:${port}/custom/bucky/setup`,
            {
                method: 'GET',
                headers: {
                    Cookie: authCookie.substring(0, authCookie.indexOf(';')),
                },
            }
        );
        console.log(buckySetupResponse);

        const buckyResponse = await fetch(
            `http://localhost:${port}/admin/custom/bucky/import?keyword=electronics&count=2`,
            {
                method: 'GET',
                headers: {
                    Cookie: authCookie.substring(0, authCookie.indexOf(';')),
                },
            }
        );
        console.log(buckyResponse);

        const whitelistResponse = await fetch(
            `http://localhost:${port}/admin/custom/whitelist?store=Hamza Official`,
            {
                method: 'GET',
                headers: {
                    Cookie: authCookie.substring(0, authCookie.indexOf(';')),
                },
            }
        );
        console.log(whitelistResponse);
        */

        const giftCardsSetup = await fetch(
            `http://localhost:${port}/admin/custom/setup/giftcards`,
            {
                method: 'POST',
                headers: {
                    Cookie: authCookie.substring(0, authCookie.indexOf(';')),
                },
                body: JSON.stringify({
                    email: 'goblinvendor@hamza.com',
                    password: 'password',
                }),
            }
        );
        console.log(await storeResponse.json());
    } catch (e) {
        console.error(e);
    }
}

main();
