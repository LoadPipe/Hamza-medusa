import { GET } from '../../api/admin/custom/route';

describe('/custom', () => {
    it('responds to GET with 200 status', async () => {
        // Correctly mocking the sendStatus method
        const sendStatusMock = jest.fn();

        const req = { method: 'GET' }; // Mock request object
        const res = { sendStatus: sendStatusMock }; // Correct mock response object

        await GET(req, res);

        // Verify that sendStatus was called with 200
        expect(sendStatusMock).toHaveBeenCalledWith(200);
    });
});
