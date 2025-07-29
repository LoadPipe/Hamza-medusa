// test for header
describe('Search', () => {
    beforeEach(() => {
        cy.visit('/en');
    });

    it('should have search bar', () => {
        cy.get(
            'input[placeholder="Search for product name, product type, brand name, category, etc..."]'
        )
            .should('exist')
            .click();

        cy.get('input[placeholder="Search products..."]')
            .should('exist')
            .type('tshirt');

        cy.get('.search-results').should('exist');

        cy.get('.search-results').find('p').contains(/shirt/i);
    });
});
