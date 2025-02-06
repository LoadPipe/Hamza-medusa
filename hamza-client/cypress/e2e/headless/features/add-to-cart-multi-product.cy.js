describe('Product page exist', () => {
	it('fetches product with handle [t-shirt]', () => {
			cy.visit('/en/products/t-shirt');
			cy.wait(2000); // Wait for page to fully load
			cy.get('h1').contains('Medusa T-Shirt');
	});

	it('fetches product with handle [drone]', () => {
			cy.visit('/en/products/drone');
			cy.wait(2000); // Wait for page to fully load
			cy.get('h1').contains('DJI Mini 3 Pro');
	});

	it('fetches product with handle [hyper-x-mouse]', () => {
			cy.visit('/en/products/hyper-x-mouse');
			cy.wait(2000); // Wait for page to fully load
			cy.get('h1').contains('HyperX Pulsefire Haste 2 Wireless Gaming Mouse Ultra Lightweight');
	});

	it('adds 3 different products to cart and checks cart', () => {
			// Tshirt
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

			// Drone
			cy.visit('/en/products/drone');

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

			// HyperX Mouse
			cy.visit('/en/products/hyper-x-mouse');

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

			cy.visit('/en/cart');

			// check tshirt
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

			// check drone
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
				.contains('DJI Mini 3 Pro');

			// check hyperx mouse
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
				.contains('HyperX Pulsefire Haste 2 Wireless Gaming Mouse Ultra Lightweight');
	});
});
