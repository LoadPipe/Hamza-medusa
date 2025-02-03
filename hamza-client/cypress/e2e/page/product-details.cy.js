describe('Product images', () => {
	beforeEach(() => {
			cy.visit('/en/products/t-shirt');
	});

	it('should have preview-gallery', () => {
			cy.get('.preview-gallery').should('exist');
	});
});

describe('Product info', () => {
	beforeEach(() => {
		cy.visit('/en/products/t-shirt');
	});

	it('should have product-info-title with text "Medusa T-Shirt"', () => {
		cy.get('.product-info-title').should('exist').and('have.text', 'Medusa T-Shirt');
	});
});

describe('Product purchase box', () => {
	beforeEach(() => {
		cy.visit('/en/products/t-shirt');
	});

	it('should have preview-checkout with add-to-cart button', () => {
		cy.get('.preview-checkout').should('exist');
		cy.get('.preview-checkout-add-to-cart').should('exist');
	});
});

describe('Store banner', () => {
	beforeEach(() => {
		cy.visit('/en/products/t-shirt');
	});

	it('should have store-banner', () => {
		cy.get('.store-banner').should('exist');
	});
});