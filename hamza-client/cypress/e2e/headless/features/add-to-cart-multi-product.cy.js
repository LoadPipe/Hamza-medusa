import { buttonClickByElementText } from '../../../support/utils/buttons/button-click-by-element-text';
import { elementCheckByElementText } from '../../../support/utils/element-check-by-element-text';

describe('Product page exist', () => {
	it('fetches product with handle [t-shirt]', () => {
			cy.visit('/en/products/t-shirt');
			cy.wait(2000); // Wait for page to fully load
			elementCheckByElementText('Medusa T-Shirt');
	});

	it('fetches product with handle [drone]', () => {
			cy.visit('/en/products/drone');
			cy.wait(2000); // Wait for page to fully load
			elementCheckByElementText('DJI Mini 3 Pro');
	});

	it('fetches product with handle [hyper-x-mouse]', () => {
			cy.visit('/en/products/hyper-x-mouse');
			cy.wait(2000); // Wait for page to fully load
			elementCheckByElementText('HyperX Pulsefire Haste 2 Wireless Gaming Mouse Ultra Lightweight');
	});

	it('adds 3 different products to cart and checks cart', () => {
			// Tshirt
			cy.visit('/en/products/t-shirt');

			buttonClickByElementText('Add to Cart');

			// Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
			elementCheckByElementText('Added to Cart');
			
			// Drone
			cy.visit('/en/products/drone');

			buttonClickByElementText('Add to Cart');

			// Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
			elementCheckByElementText('Added to Cart');

			// HyperX Mouse
			cy.visit('/en/products/hyper-x-mouse');

			buttonClickByElementText('Add to Cart');

			// Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
			elementCheckByElementText('Added to Cart');

			cy.visit('/en/cart');

			// check tshirt
			elementCheckByElementText('Medusa T-Shirt');

			// check drone
			elementCheckByElementText('DJI Mini 3 Pro');

			// check hyperx mouse
			elementCheckByElementText('HyperX Pulsefire Haste 2 Wireless Gaming Mouse Ultra Lightweight');
	});
});
