async function main() {
    const port = process.env.PORT;
    try {
        const authResponse = await fetch(
            `http://localhost:${port}/admin/auth`,
            {
                method: 'POST',
                body: JSON.stringify({
                    email: process.env.ADMIN_EMAIL,
                    password: process.env.ADMIN_PASSWORD,
                }),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            }
        );
        const authData = await authResponse.json();
        const authCookie = authResponse.headers.get('set-cookie');

        console.log(authData);

        const giftCardsSetup = await fetch(
            `http://localhost:${port}/admin/custom/setup/giftcards?behavior=add-only`,
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
    } catch (e) {
        console.error(e);
    }
}

main();
