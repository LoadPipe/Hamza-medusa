async function main() {
    const port = 9001;
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
            `http://localhost:${port}/admin/custom/bucky/verify?order_id=${process.argv[2]}`,
            {
                method: 'GET',
                headers: {
                    Cookie: authCookie.substring(0, authCookie.indexOf(';')),
                },
            }
        );

        console.log(await buckyResponse.json());
    } catch (e) {
        console.error(e);
    }
}

main();
