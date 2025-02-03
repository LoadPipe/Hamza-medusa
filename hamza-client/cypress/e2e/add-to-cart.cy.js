describe('Product page', () => {
    it('fetches product with handle [t-shirt]', () => {
        cy.visit('/en/products/t-shirt');
        cy.wait(2000); // Wait for page to fully load
        cy.get('h1').contains('Medusa T-Shirt');
    });

    // it('adds a product to the cart', () => {
    //     cy.visit('/en/products/t-shirt');

    //     cy.get('[data-cy=add-to-cart-button]')
    //         .should('be.visible')
    //         .should('not.be.disabled')
    //         .contains('Add to Cart')
    //         .click();
    // });

    // it('check cart', () => {
    //     cy.wait(2000);
    //     cy.visit('/en/cart');
    //     cy.get('p').contains('Medusa T-Shirt');
    // });
});
