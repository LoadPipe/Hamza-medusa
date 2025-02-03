describe('Product page', () => {
    it('fetches product with handle [t-shirt]', () => {
        cy.visit('/en/products/t-shirt');
        cy.wait(2000); // Wait for page to fully load
        cy.get('h1').contains('Medusa T-Shirt');
    });

    it('adds a product to the cart', () => {
        cy.visit('/en/products/t-shirt');

        cy.get('.preview-checkout-add-to-cart')
            .should('be.visible')
            .should('not.be.disabled')
            .contains('Add to Cart')
            .click();

        // Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
        cy.contains('Added to Cart', { timeout: 12000 })
            .should('be.visible')
            .should((elem) => {
                return new Cypress.Promise((resolve, reject) => {
                    let attempts = 0;
                    const check = () => {
                        attempts++;
                        if (Cypress.$(elem).is(':visible')) {
                            resolve();
                        } else if (attempts >= 3) {
                            reject(new Error('Element not visible after 3 attempts'));
                        } else {
                            setTimeout(check, 4000);
                        }
                    };
                    check();
                });
            });
    });

    it('adds a product to the cart and checks cart', () => {
        cy.visit('/en/products/t-shirt');

        cy.get('.preview-checkout-add-to-cart')
            .should('be.visible')
            .should('not.be.disabled')
            .contains('Add to Cart')
            .click();

        // Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
        cy.contains('Added to Cart', { timeout: 12000 })
            .should('be.visible')
            .should((elem) => {
                return new Cypress.Promise((resolve, reject) => {
                    let attempts = 0;
                    const check = () => {
                        attempts++;
                        if (Cypress.$(elem).is(':visible')) {
                            resolve();
                        } else if (attempts >= 3) {
                            reject(new Error('Element not visible after 3 attempts'));
                        } else {
                            setTimeout(check, 4000);
                        }
                    };
                    check();
                });
            });

        cy.visit('/en/cart');
        cy.get('p').contains('Medusa T-Shirt');
    });
});
