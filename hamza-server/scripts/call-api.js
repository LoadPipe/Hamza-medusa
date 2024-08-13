async function main() {
    try {
        const authResponse = await fetch('http://localhost:9000/admin/auth', {
            method: 'POST',
            body: JSON.stringify({
                email: 'admin@medusa-test.com',
                password: 'supersecret',
            }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        const authData = await authResponse.json();
        const authCookie = authResponse.headers.get('set-cookie');

        const response = await fetch(
            'http://localhost:9000/admin/custom/user?email=goblinvendor@hamza.com&password=password',
            {
                method: 'GET',
                headers: {
                    Cookie: authCookie.substring(0, authCookie.indexOf(';')),
                },
            }
        );

        /*
        await fetch('http://localhost:9000/admin/custom/massmarket', {
            method: 'GET',
            headers: {
                Cookie: authCookie.substring(0, authCookie.indexOf(';')),
            },
        });
        */

        await fetch('http://localhost:9000/admin/custom/whitelist?store=Hamza Official', {
            method: 'GET',
            headers: {
                Cookie: authCookie.substring(0, authCookie.indexOf(';')),
            },
        });
    } catch (e) {
        console.error(e);
    }
}

main();
