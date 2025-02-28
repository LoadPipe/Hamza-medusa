describe('Store header', () => {
    beforeEach(() => {
        // Assuming the store page URL is '/store'
        cy.visit('/en/store/medusa-merch');
    });

    it('should display the product header with classname store-header', () => {
        // Check if the element with classname 'store-header' exists
        cy.get('.store-header').should('exist');
    });

		it('should have store name', () => {
			cy.get('.store-name').should('exist').and('contain', 'Medusa Merch');
		});

		it('should have store product count', () => {
			cy.get('.store-product-count').should('exist').and('contain', '7');
		});
});

describe('Store filters', () => {
	beforeEach(() => {
			// Assuming the store page URL is '/store'
			cy.visit('/en/store/medusa-merch');
	});

	it('should have product filters: all, home, fashion, featured', () => {
			// Check if the element with classname 'store-header' exists
			cy.get('.store-filters').should('exist');
			cy.get('.store-filters').within(() => {
				cy.get('p').contains('All').should('exist');
				cy.get('p').contains('Home').should('exist');
				cy.get('p').contains('Fashion').should('exist');
				cy.get('p').contains('Featured').should('exist');
			});

	});
});

describe('Store products', () => {
	beforeEach(() => {
			// Assuming the store page URL is '/store'
			cy.visit('/en/store/medusa-merch');
	});

	it('should have product cards', () => {
		cy.get('.product-card').should('exist');
		cy.get('.product-card').should('have.length', 7);
	});
});
