import AuthService from '../__mocks__/authService';
import axios from 'axios';

describe('Auth API', () => {
    const baseURL = 'http://localhost:9000'; // Change this to your server's base URL if different

    it('should authenticate user and return user details', async () => {
        try {
            const response = await axios.post(`${baseURL}/admin/auth`, {
                email: 'admin@medusa-test.com',
                password: 'supersecret',
            });

            const user = response.data.user;

            expect(response.status).toBe(200);
            expect(user).toMatchObject({
                role_id: null,
                role: 'admin',
                email: 'admin@medusa-test.com',
                first_name: null,
                last_name: null,
                api_token: null,
                metadata: null,
                deleted_at: null,
            });

            expect(typeof user.wallet_address).toBe('string');
            expect(user.wallet_address.startsWith('0x')).toBe(true);
            expect(typeof user.id).toBe('string');
            expect(typeof user.created_at).toBe('string');
            expect(typeof user.updated_at).toBe('string');
        } catch (error) {
            console.error('Error in test:', error);
            throw error;
        }
    });

    it('should return 401 for invalid credentials', async () => {
        try {
            await axios.post(`${baseURL}/admin/auth`, {
                email: 'wrong@medusa-test.com',
                password: 'wrongpassword',
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toEqual('Unauthorized');
            expect(error.response.headers['content-type']).toBe(
                'text/plain; charset=utf-8'
            );
        }
    });
});
