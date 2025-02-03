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

    it('should have 4 product cards', () => {
        cy.get('.product-cards').should('exist').within(() => {
            cy.get('.product-card').should('have.length.at.least', 4);
        });
    });
});

// test for footer
