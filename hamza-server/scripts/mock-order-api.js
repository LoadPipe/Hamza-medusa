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

        const mockOrder = await fetch(
            `http://localhost:${port}/admin/custom/mock-orders?count=75`,
            {
                method: 'POST',
                headers: {
                    Cookie: authCookie.substring(0, authCookie.indexOf(';')),
                },
            }
        );

        console.log(mockOrder);
        console.log(await mockOrder.json());
    } catch (e) {
        console.error(e);
    }
}

main();
