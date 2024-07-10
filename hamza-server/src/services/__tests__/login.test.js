import { POST } from '../../api/admin/auth'; // Make sure this import points to your actual function

describe('/admin/auth', () => {
    it('should authenticate an admin user successfully', async () => {
        // Mocking the json and status methods for the response
        const jsonMock = jest.fn();
        const statusMock = jest.fn(() => ({ json: jsonMock }));

        // Creating mock request and response objects
        const req = {
            method: 'POST',
            body: {
                email: 'admin@medusa-test.com',
                password: 'supersecret',
            },
        };
        const res = {
            status: statusMock,
        };

        // Calling the POST function
        await POST(req, res);

        // Verify that the status was called with 200 or any appropriate success code
        expect(statusMock).toHaveBeenCalledWith(200);

        // Optionally check if json is called with expected object, e.g., containing a token
        // expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        //    token: expect.any(String)
        // }));
    });
});
