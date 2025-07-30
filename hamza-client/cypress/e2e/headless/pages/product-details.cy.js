import { buttonClickByElementClass } from '../../../support/utils/buttons/button-click-by-element-class';
import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';
import { buttonClickByElementText } from '../../../support/utils/buttons/button-click-by-element-text';

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

describe('Increment and decrement Quantity', () => {
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

        elementCheckByElementClass('.preview-checkout .quantity-display', {
            scrollIntoView: false,
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

        cy.wait(1000);

        elementCheckByElementClass('.preview-checkout', {
            findByChild: '.quantity-display',
        }).should('have.text', '2');
    });
});

describe('Link checks', () => {
    beforeEach(() => {
        cy.visit('/en/products/t-shirt');
    });

    it('Shipping policies', () => {
        // wait till preview checkout add to cart button is visible
        elementCheckByElementClass('.preview-checkout', {
            findByChild: '.preview-checkout-add-to-cart',
            disabled: false,
        });

        buttonClickByElementText('See shipping policy');

        // check for shipping policy modal title
        elementCheckByElementClass('p', {
            findByChild: 'Shipping & Delivery',
            isVisible: true,
        });
    });

    it('Returns policy', () => {
        // wait till preview checkout add to cart button is visible
        elementCheckByElementClass('.preview-checkout', {
            findByChild: '.preview-checkout-add-to-cart',
            disabled: false,
        });

        buttonClickByElementText('See returns policy');

        // check for shipping policy modal title
        elementCheckByElementClass('p', {
            findByChild: 'Return Policy',
            isVisible: true,
        });
    });

    it('Payment Policies and Cancellation', () => {
        // wait till preview checkout add to cart button is visible
        elementCheckByElementClass('.preview-checkout', {
            findByChild: '.preview-checkout-add-to-cart',
            disabled: false,
        });

        buttonClickByElementText('See payment method policy');

        // check for shipping policy modal title
        elementCheckByElementClass('p', {
            findByChild: 'Payment Policies and Cancellation',
            isVisible: true,
        });
    });

    it('Chat with them', () => {
        // wait till preview checkout add to cart button is visible
        elementCheckByElementClass('.preview-checkout', {
            findByChild: '.preview-checkout-add-to-cart',
            disabled: false,
        });

        // checks for external url
        elementCheckByElementClass('a', {
            findByChild: 'Chat with them',
            isVisible: true,
        })
            .parents('a')
            .should('have.attr', 'href')
            .and('include', 'https://hns-chat.hamza.market');
    });

    it('Visit Store', () => {
        // wait till preview checkout add to cart button is visible
        elementCheckByElementClass('.preview-checkout', {
            findByChild: '.preview-checkout-add-to-cart',
            disabled: false,
        });

        cy.wait(3000);

        // TODO: store link actually is not available until store has completely loaded.
        // BUG: race condition related issue.
        buttonClickByElementText('Visit Store');

        cy.url().should('include', '/en/store/medusa-merch');

        elementCheckByElementClass('.store-name', {
            findByChild: 'Medusa Merch',
            isVisible: true,
        });
    });
});

describe('Link check: product details back', () => {
    beforeEach(() => {
        cy.visit('/en/');
    });

    it('back to results', () => {
        cy.visit('/en/products/t-shirt');

        buttonClickByElementText('Back to results');

        // check if we're back to home page
        cy.url().should('include', '/en');
    });
});
