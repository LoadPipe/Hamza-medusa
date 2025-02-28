describe('Product page', () => {
	it('fetches product with handle [t-shirt]', () => {
			cy.visit('/en/products/t-shirt');
			cy.wait(2000); // Wait for page to fully load
			cy.get('h1').contains('Medusa T-Shirt');
	});

	it('adds White/XL and Black/Mtshirt', () => {
		cy.visit('/en/products/t-shirt');
		cy.wait(2000); // Wait for page to fully load
		cy.get('h1').contains('Medusa T-Shirt');

		// adding White/XL 
		cy.get('button')
			.contains('XL')
			.click();

		cy.get('button')
			.contains('White')
			.click();

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

		// adding White/XL 
		cy.get('button')
			.contains('M')
			.click();

		cy.get('button')
			.contains('Black')
			.click();

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

			// check cart
			cy.visit('/en/cart');

			cy.wait(2000); // Wait for page to fully load

			cy.get('.cart-item-container')
				.contains('XL / White');

			cy.get('.cart-item-container')
				.contains('M / Black');
				
			cy.get('.cart-quantity').should('have.text', '2');
	});
});