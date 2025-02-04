// test for header
describe('Homepage', () => {
	beforeEach(() => {
			cy.visit('/en');
	});

	it('should have search bar', () => {
		cy.get('input[placeholder="Search for product name, product..."]').should('exist').click();

		cy.get('input[placeholder="Search products..."]').should('exist').type('tshirt');
		
		cy.get('.search-results').should('exist');

		cy.get('.search-results').find('p').contains(/shirt/i);
		
	});
});