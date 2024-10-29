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

        const response = await fetch(
            `http://localhost:${port}/admin/custom/logs`,
            {
                method: 'DELETE',
                headers: {
                    Cookie: authCookie.substring(0, authCookie.indexOf(';')),
                },
            }
        );

        console.log(response);
        console.log(await response.json());
    } catch (e) {
        console.error(e);
    }
}

main();
