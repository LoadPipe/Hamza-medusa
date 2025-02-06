describe('Product page', () => {
	it('buy now for [t-shirt]', () => {
			cy.visit('/en/products/t-shirt');
			cy.wait(2000); // Wait for page to fully load
			cy.get('h1').contains('Medusa T-Shirt');

			//buy now button
			cy.get('.buy-now-button')
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
								reject(new Error('Buy Now button still disabled after 10 seconds'));
							} else {
								setTimeout(check, 2000);
							}
						};
						check();
					});
				})
				.click();

			//connect wallet button
			cy.get('button')
				.contains('Connect Wallet', { timeout: 10000 })
				.should('be.visible')
				.should((elem) => {
					return new Cypress.Promise((resolve, reject) => {
						let attempts = 0;
						const maxAttempts = 5; // 10 seconds total with 2s intervals
						const check = () => {
							attempts++;
							if (Cypress.$(elem).is(':visible')) {
								resolve();
							} else if (attempts >= maxAttempts) {
								reject(new Error('Connect Wallet button not visible after 10 seconds'));
							} else {
								setTimeout(check, 2000);
							}
						};
						check();
					});
				})
				.click();

			// Simulate wallet selection (MetaMask in this case)
			cy.contains("MetaMask").click();

			cy.contains("Sign message").click();
	
			cy.contains('Verify your account').should('not.exist');

			cy.get('.cart-item-container', { timeout: 10000 })
				.should('be.visible')
				.should((elem) => {
					return new Cypress.Promise((resolve, reject) => {
						let attempts = 0;
						const maxAttempts = 5; // 10 seconds total with 2s intervals
						const check = () => {
							attempts++;
							if (Cypress.$(elem).is(':visible')) {
								resolve();
							} else if (attempts >= maxAttempts) {
								reject(new Error('Cart item container not visible after 10 seconds'));
							} else {
								setTimeout(check, 2000);
							}
						};
						check();
					});
				})
				.find('p')
				.contains('Medusa T-Shirt');
	});

	
});