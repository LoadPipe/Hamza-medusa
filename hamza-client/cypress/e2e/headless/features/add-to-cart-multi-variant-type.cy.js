import { elementCheckByElementText } from '../../../support/utils/element-check-by-element-text';
import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';
import { buttonClickByElementClass } from '../../../support/utils/buttons/button-click-by-element-class';
import { buttonClickByElementText } from '../../../support/utils/buttons/button-click-by-element-text';

describe('Product page', () => {
	it('fetches product with handle [t-shirt]', () => {
			cy.visit('/en/products/t-shirt');
			cy.wait(2000); // Wait for page to fully load
			elementCheckByElementText('Medusa T-Shirt');
	});

	it('adds White/XL and Black/Mtshirt', () => {
		cy.visit('/en/products/t-shirt');
		cy.wait(2000); // Wait for page to fully load
		elementCheckByElementText('Medusa T-Shirt');

		// adding White/XL 
		buttonClickByElementClass('button:contains(XL)');

		buttonClickByElementClass('button:contains(White)');

		buttonClickByElementText('Add to Cart');

		// Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
		elementCheckByElementText('Added to Cart');

		// click on "continue shopping"
		buttonClickByElementText('Continue Shopping');

		// adding White/XL 
		buttonClickByElementClass('button:contains(M)');

		buttonClickByElementClass('button:contains(Black)');

		buttonClickByElementText('Add to Cart');

		// Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
		elementCheckByElementText('Added to Cart');

		// click on "continue shopping"
		buttonClickByElementText('Continue Shopping');

			// check cart
			cy.visit('/en/cart');

			cy.wait(2000); // Wait for page to fully load

			elementCheckByElementClass('.cart-item-container:contains(XL / White)');

			elementCheckByElementClass('.cart-item-container:contains(M / Black)');

			elementCheckByElementClass('.cart-quantity', true).should('have.text', '2');
	});
});