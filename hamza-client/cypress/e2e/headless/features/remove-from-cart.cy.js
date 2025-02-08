import { elementCheckByElementText } from '../../../support/utils/element-check-by-element-text';
import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';
import { buttonClickByElementText } from '../../../support/utils/buttons/button-click-by-element-text';

describe('Product page exist', () => {
	it('fetches product with handle [drone]', () => {
			cy.visit('/en/products/drone');
			elementCheckByElementText('DJI Mini 3 Pro');

	});

	it('fetches product with handle [hyper-x-mouse]', () => {
			cy.visit('/en/products/hyper-x-mouse');
			elementCheckByElementText('HyperX Pulsefire Haste 2 Wireless Gaming Mouse Ultra Lightweight');
	});

	it('adds 2 different products to cart and deletes from cart', () => {
			// Drone
			cy.visit('/en/products/drone');

			buttonClickByElementText('Add to Cart');

			// Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
			elementCheckByElementText('Added to Cart');

			// HyperX Mouse
			cy.visit('/en/products/hyper-x-mouse');

			buttonClickByElementText('Add to Cart');

			// Check for modal popup with "Added to Cart" text, retry 5 times with 4s intervals
			elementCheckByElementText('Added to Cart');

			// Cart ----------------------------------------------------------------
			cy.visit('/en/cart');

			// check drone -------------------------------------------------------------
			elementCheckByElementClass('.cart-item-container', {
                findByChild: 'DJI Mini 3 Pro',
                scrollIntoView: true,
            })
                .parents('.cart-item-container')
                .find('.delete-button')
                .click();

			// check hyperx mouse
			elementCheckByElementClass('.cart-item-container', {
                findByChild:
                    'HyperX Pulsefire Haste 2 Wireless Gaming Mouse Ultra Lightweight',
                scrollIntoView: true,
            })
                .parents('.cart-item-container')
                .find('.delete-button')
                .click();
	});
});
