class AuthService {
    public async authenticate(email: string, password: string) {
        console.log('Mock authenticate called');
        if (email === 'admin@medusa-test.com' && password === 'supersecret') {
            return {
                role_id: null,
                wallet_address: '0x84318B362Cf6a7DBc46655bF66dF3B5e2a17eb9A',
                id: 'usr_01J20RCEG32K0ZE7Q5E4YM60WB',
                created_at: '2024-07-05T06:12:55.914Z',
                updated_at: '2024-07-05T06:12:55.914Z',
                deleted_at: null,
                role: 'admin',
                email: 'admin@medusa-test.com',
                first_name: null,
                last_name: null,
                api_token: null,
                metadata: null,
            };
        } else {
            throw new Error('Invalid credentials');
        }
    }
}

export default AuthService;
