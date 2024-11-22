require('dotenv').config();
console.log(process.env);

async function main() {
    const port = process.env.PORT || 9000;
    console.log(`Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD}`);

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

        const mockOrder = await fetch(
            `http://localhost:${port}/admin/custom/mock-orders`,
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
