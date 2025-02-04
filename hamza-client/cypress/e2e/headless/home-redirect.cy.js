describe('Root redirect', () => {
    it('redirects from root to /en', () => {
        cy.visit('/');
        cy.url().should('include', '/en');
        cy.location('pathname').should('eq', '/en');
    });
});
