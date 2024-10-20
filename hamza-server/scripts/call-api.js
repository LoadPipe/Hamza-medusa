require('dotenv').config();

async function main() {
    const port = process.env.PORT;
    try {
        const authResponse = await fetch(`http://localhost:${port}/admin/auth`, {
            method: 'POST',
            body: JSON.stringify({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
            }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        const authData = await authResponse.json();
        const authCookie = authResponse.headers.get('set-cookie');

        console.log(authData);

        const storeResponse = await fetch(
            `http://localhost:${port}/admin/custom/user?email=goblinvendor@hamza.com&password=password`,
            {
                method: 'GET',
                headers: {
                    Cookie: authCookie.substring(0, authCookie.indexOf(';')),
                },
            }
        );
        console.log(storeResponse);

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

        const whitelistResponse = await fetch(`http://localhost:${port}/admin/custom/whitelist?store=Hamza Official`, {
            method: 'GET',
            headers: {
                Cookie: authCookie.substring(0, authCookie.indexOf(';')),
            },
        });
        console.log(whitelistResponse);
    } catch (e) {
        console.error(e);
    }
}

main();
