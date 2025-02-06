describe('Product page', () => {
    it('fetches product with handle [t-shirt]', () => {
        cy.visit('/en/products/t-shirt');
        cy.wait(2000); // Wait for page to fully load
        cy.get('h1').contains('Medusa T-Shirt');
    });

    it('adds single product to the cart', () => {
        cy.visit('/en/products/t-shirt');

        cy.get('.preview-checkout-add-to-cart')
            .should('be.visible')
            .should('not.be.disabled')
            .contains('Add to Cart')
            .click();

        // Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
        cy.contains('Added to Cart', { timeout: 10000 })
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
                            setTimeout(check, 2000);
                        }
                    };
                    check();
                });
            });
    });

    it('adds 3 quantity to the cart', () => {
        cy.visit('/en/products/t-shirt');

        // TODO: Since zustand store is used, testing this is more tricky.
        // cy.wait(3000);

        // // checks plus and minus functionality
        // for (let i = 0; i < 3; i++) {
        //     cy.get('.quantity-button-increment').click();
        //     cy.wait(3000);
        // }

        // cy.get('.quantity-button-decrement').click();

        // cy.wait(3000);

        // // check quantity is 3
        // cy.get('.quantity-display').should('have.text', '3');

        // cy.wait(3000);

        // adds 1st to cart
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

        // click on "continue shopping"
        cy.get('button')
            .contains('Continue Shopping')
            .click();
            

        // adds 2nd to cart
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

        // click on "continue shopping"
        cy.get('button')
            .contains('Continue Shopping')
            .click();

        // adds 3rd to cart
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

        // click on "continue shopping"
        cy.get('button')
            .contains('Continue Shopping')
            .click();
            
        // checks cart quantity in nav
        cy.get('.cart-quantity').should('have.text', '3');

        cy.wait(3000);

        // cart check
        cy.visit('/en/cart');
        cy.get('.cart-item-container').find('p').contains('Medusa T-Shirt');
        cy.get('.cart-item-container').find('.cart-item-quantity-display').contains('3');

        // test cart increment and decrement
        cy.get('.cart-item-container').find('.cart-item-quantity-button-decrement')
            .should('be.visible')
            .should('not.be.disabled')
            .click();
        
        cy.get('.checkout-now-button')
            .should('be.visible')
            .should((elem) => {
                return new Cypress.Promise((resolve, reject) => {
                    let attempts = 0;
                    const maxAttempts = 5; // 10 seconds total with 2s intervals
                    const check = () => {
                        attempts++;
                        if (!Cypress.$(elem).prop('disabled')) {
                            resolve();
                        } else if (attempts >= maxAttempts) {
                            reject(new Error('Button remained disabled after 10 seconds'));
                        } else {
                            setTimeout(check, 2000);
                        }
                    };
                    check();
                });
            })

        cy.get('.cart-item-container').find('.cart-item-quantity-display').contains('2');

        cy.get('.cart-item-container').find('.cart-item-quantity-button-increment')
            .should('be.visible')
            .should('not.be.disabled')
            .click();
            
        cy.get('.checkout-now-button')
            .should('be.visible')
            .should((elem) => {
                return new Cypress.Promise((resolve, reject) => {
                    let attempts = 0;
                    const maxAttempts = 5; // 10 seconds total with 2s intervals
                    const check = () => {
                        attempts++;
                        if (!Cypress.$(elem).prop('disabled')) {
                            resolve();
                        } else if (attempts >= maxAttempts) {
                            reject(new Error('Button remained disabled after 10 seconds'));
                        } else {
                            setTimeout(check, 2000);
                        }
                    };
                    check();
                });
            })
            
        cy.get('.cart-item-container').find('.cart-item-quantity-display').contains('3');
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
