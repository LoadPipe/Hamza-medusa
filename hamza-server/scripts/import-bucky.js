async function main() {
    const port = 9000;
    try {
        const authResponse = await fetch(`http://localhost:${port}/admin/auth`, {
            method: 'POST',
            body: JSON.stringify({
                email: 'admin@medusa-test.com',
                password: 'supersecret',
            }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        const authData = await authResponse.json();
        const authCookie = authResponse.headers.get('set-cookie');

        const buckyResponse = await fetch(
            `http://localhost:${port}/admin/custom/bucky/import`,
            {
                method: 'GET',
                headers: {
                    Cookie: authCookie.substring(0, authCookie.indexOf(';')),
                },
            }
        );

        console.log(buckyResponse);
    } catch (e) {
        console.error(e);
    }
}

main();
