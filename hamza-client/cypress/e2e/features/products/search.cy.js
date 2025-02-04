// test for header
describe('Homepage', () => {
	beforeEach(() => {
			cy.visit('/en');
	});

	it('should have search bar', () => {
		cy.get('input[placeholder="Search for product name, product..."]').should('exist');
	});
});