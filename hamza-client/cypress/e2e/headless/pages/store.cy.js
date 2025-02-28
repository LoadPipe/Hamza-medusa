import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';
import { buttonClickByElementClass } from '../../../support/utils/buttons/button-click-by-element-class';

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

		it('Chat with them', () => {
			// checks for external url
			elementCheckByElementClass('a', {
				findByChild: 'Chat with them',
				isVisible: true,
			}).parents('a').should('have.attr', 'href', 'https://support.hamza.market/help/1568263160');
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

	it('filters: home', () => {
			buttonClickByElementClass('.store-filters', { findByChild: 'Home', exist: true });

			elementCheckByElementClass('.product-card', { scrollIntoView: false }).should('have.length', 1);
	});

	it('filters: fashion', () => {
		buttonClickByElementClass('.store-filters', { findByChild: 'Fashion', exist: true });

		elementCheckByElementClass('.product-card', { scrollIntoView: false }).should('have.length', 6);
	});

	it('filters: featured', () => {
		buttonClickByElementClass('.store-filters', { findByChild: 'Featured', exist: true });

		elementCheckByElementClass('.product-card', { scrollIntoView: false }).should('have.length', 3);
	});

	it('filters: home, fashion, featured', () => {
		buttonClickByElementClass('.store-filters', { findByChild: 'Home', exist: true });
		buttonClickByElementClass('.store-filters', { findByChild: 'Fashion', exist: true });
		buttonClickByElementClass('.store-filters', { findByChild: 'Featured', exist: true });

		elementCheckByElementClass('.product-card', { scrollIntoView: false }).should('have.length', 7);
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


