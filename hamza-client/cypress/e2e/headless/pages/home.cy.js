import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';

// test for header
describe('Homepage header', () => {
    beforeEach(() => {
        cy.visit('/en');
    });

    it('should have nav-container and desktop-nav', () => {
        cy.get('.nav-container').should('exist');
        cy.get('.nav-container').within(() => {
            cy.get('.desktop-nav').should('exist');
        });
    });

    it('should have "How it Works" button with correct link', () => {
        cy.get('.nav-container').within(() => {
            cy.contains('button', 'How it Works')
                .should('exist')
                .should('be.visible')
                .parent()
                .should('have.attr', 'href', '/en/how-it-works');
        });
    });

    it('should navigate to "How it Works" page with correct text', () => {
        cy.get('.nav-container').within(() => {
            cy.contains('button', 'How it Works').click();
        });

        cy.contains('The Future of Commerce').should('exist');
    });
});

// test for filter bar
describe('Filter bar', () => {
    beforeEach(() => {
        cy.visit('/en');
    });

    it('should have filter-bar', () => {
        cy.get('.filter-bar').should('exist');
    });
});

// test for product cards (x 4)
describe('Product cards', () => {
    beforeEach(() => {
        cy.visit('/en');
    });

    it('should have at least 4 product cards', () => {
        elementCheckByElementClass('.product-cards .product-card', {
            scrollIntoView: false,
        }).should('have.length.at.least', 4);
    });
});

// test for footer
describe('Footer', () => {
    beforeEach(() => {
        cy.visit('/en');
    });

    it('should have footer', () => {
        cy.get('.footer').should('exist');
    });

    it('should have Merchant link in footer', () => {
        cy.get('.footer')
            .contains('Merchant')
            .should('exist')
            .should('have.attr', 'href', '/seller');
    });

    it('should navigate to seller page with "Join the Revolution" text when clicking Merchant link', () => {
        cy.get('.footer').contains('Merchant').click();

        cy.contains('Join the Revolution').should('exist');
    });
});
