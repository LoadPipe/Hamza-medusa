import { buttonClickByElementClass } from '../../../support/utils/buttons/button-click-by-element-class';
import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';

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
        cy.get('.product-info-title')
            .should('exist')
            .and('contain', 'Medusa T-Shirt');
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

describe('Increment Quantity', () => {
    beforeEach(() => {
        cy.visit('/en/products/t-shirt');
    });

    it('Increment and decrement quantity', () => {
        // wait till preview checkout add to cart button is visible
        elementCheckByElementClass('.preview-checkout', {
            findByChild: '.preview-checkout-add-to-cart',
            disabled: false,
        });

        buttonClickByElementClass('.preview-checkout', {
            findByChild: '.quantity-button-increment',
        });

        elementCheckByElementClass('.preview-checkout', {
            findByChild: '.quantity-display',
        }).should('have.text', '2');

        buttonClickByElementClass('.preview-checkout', {
            findByChild: '.quantity-button-increment',
				});

        elementCheckByElementClass('.preview-checkout', {
            findByChild: '.quantity-display',
        }).should('have.text', '3');
		
				buttonClickByElementClass('.preview-checkout', {
            findByChild: '.quantity-button-decrement',
        });

        elementCheckByElementClass('.preview-checkout', {
            findByChild: '.quantity-display',
        }).should('have.text', '2');
    });
});
