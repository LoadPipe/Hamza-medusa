async function simulateServerError(delay: number) {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Server-side network error has occurred'));
        }, delay);
    });
}

export default async function SettingsPage() {
    await simulateServerError(2000);

    return <h1>Settings page loaded successfully</h1>;
}
