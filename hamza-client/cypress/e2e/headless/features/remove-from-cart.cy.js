describe('Product page exist', () => {
	it('fetches product with handle [drone]', () => {
			cy.visit('/en/products/drone');
			cy.get('h1').contains('DJI Mini 3 Pro');
	});

	it('fetches product with handle [hyper-x-mouse]', () => {
			cy.visit('/en/products/hyper-x-mouse');
			cy.get('h1').contains(/HyperX Pulsefire Haste 2 Wireless Gaming Mouse Ultra Lightweight/i);
	});

	it('adds 2 different products to cart and deletes from cart', () => {
			// Drone
			cy.visit('/en/products/drone');

			cy.get('.preview-checkout-add-to-cart')
					.should('be.visible')
					.should('not.be.disabled')
					.contains('Add to Cart')
					.click();

			// Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
			cy.contains('Added to Cart')
					.should((elem) => {
							return new Cypress.Promise((resolve, reject) => {
									let attempts = 0;
									const check = () => {
											attempts++;
											if (Cypress.$(elem).is(':visible')) {
													resolve();
											} else if (attempts >= 10) {
													reject(new Error('Element not visible after 5 attempts'));
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

			// Check for modal popup with "Added to Cart" text, retry 5 times with 4s intervals
			cy.contains('Added to Cart')
					.should((elem) => {
							return new Cypress.Promise((resolve, reject) => {
									let attempts = 0;
									const check = () => {
											attempts++;
											if (Cypress.$(elem).is(':visible')) {
													resolve();
											} else if (attempts >= 10) {
													reject(new Error('Element not visible after 5 attempts'));
											} else {
													setTimeout(check, 2000);
											}
									};
									check();
							});
					});

			// Cart ----------------------------------------------------------------
			cy.visit('/en/cart');

			// check drone -------------------------------------------------------------
			cy.get('.cart-item-container')
				.should((elem) => {
					return new Cypress.Promise((resolve, reject) => {
						let attempts = 0;
						const check = () => {
							attempts++;
							if (Cypress.$(elem).is(':visible')) {
								resolve();
							} else if (attempts >= 10) {
								reject(new Error('Cart item container not visible after 10 seconds'));
							} else {
								setTimeout(check, 2000);
							}
						};
						check();
					});
				})
				.contains('p', 'DJI Mini 3 Pro')
				.parents('.cart-item-container')
				.find('.delete-button')
				.click();

			// check hyperx mouse
			cy.get('.cart-item-container')
				.should((elem) => {
					return new Cypress.Promise((resolve, reject) => {
						let attempts = 0;
						const check = () => {
							attempts++;
							if (Cypress.$(elem).is(':visible')) {
								resolve();
							} else if (attempts >= 10) {
								reject(new Error('Cart item container not visible after 10 seconds'));
							} else {
								setTimeout(check, 2000);
							}
						};
						check();
					});
				})
				.find('p')
				.contains(/HyperX Pulsefire Haste 2 Wireless Gaming Mouse Ultra Lightweight/i)
				.parents('.cart-item-container')
				.find('.delete-button')
				.click();
	});
});
