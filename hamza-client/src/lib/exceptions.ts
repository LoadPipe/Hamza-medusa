export class AuthRequiredError extends Error {
    constructor(message = 'Verify your email to access this page.') {
        super(message);
        this.name = 'AuthRequiredError';
    }
}
