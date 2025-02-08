import { elementCheckByElementText } from '../../../support/utils/element-check-by-element-text';	
import { buttonClickByElementText } from '../../../support/utils/buttons/button-click-by-element-text';
import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';

// Add these helper functions before the describe block

describe('Cart Calculations: multi item totals', () => {
	it('adds 2 item to cart and checks cart totals', () => {
			// Tshirt
			cy.visit('/en/products/t-shirt');

			buttonClickByElementText('Add to Cart');

			// Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
			elementCheckByElementText('Added to Cart');

			// Tshirt
			cy.visit('/en/products/coffee-mug');

			buttonClickByElementText('Add to Cart');

			// Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
			elementCheckByElementText('Added to Cart');

			// Check for cart totals
			cy.visit('/en/cart');

			// Get initial values and wait for them to resolve
			// first element ---------------------------------------------------------------
			elementCheckByElementClass('.cart-item-container:first', {
				findByChild: '.line-item-unit-price',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_price_first');

			elementCheckByElementClass('.cart-item-container:first', {
				findByChild: '.cart-item-quantity-display',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_quantity_first');

			elementCheckByElementClass('.cart-item-container:first', {
				findByChild: '.line-item-price',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_subtotal_first');

			// second element ---------------------------------------------------------------// first element ---------------------------------------------------------------
			elementCheckByElementClass('.cart-item-container:last', {
				findByChild: '.line-item-unit-price',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_price_second');

			elementCheckByElementClass('.cart-item-container:first', {
				findByChild: '.cart-item-quantity-display',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_quantity_second');

			elementCheckByElementClass('.cart-item-container:first', {
				findByChild: '.line-item-price',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_subtotal_second');

			cy.get('.cart-totals-subtotal').invoke('text').then(text => parseFloat(text.trim())).as('cart_subtotal');
			cy.get('.cart-totals-shipping').invoke('text').then(text => parseFloat(text.trim())).as('cart_shipping');
			cy.get('.cart-totals-total').invoke('text').then(text => parseFloat(text.trim())).as('cart_total');

			cy.get('@unit_price_first').then(unit_price_first => {
				cy.get('@unit_quantity_first').then(unit_quantity_first => {
					cy.get('@unit_price_second').then(unit_price_second => {
						cy.get('@unit_quantity_second').then(unit_quantity_second => {
							cy.get('@cart_subtotal').then(cart_subtotal => {
								cy.get('@cart_shipping').then(cart_shipping => {
									cy.get('@cart_total').then(cart_total => {
										const calc_subtotal_first = unit_price_first * unit_quantity_first;
										const calc_subtotal_second = unit_price_second * unit_quantity_second;
										const calc_subtotal = calc_subtotal_first + calc_subtotal_second;
										expect(calc_subtotal).to.equal(cart_subtotal);
										expect(calc_subtotal + cart_shipping).to.equal(cart_total);
									});
								});
							});
						});
					});
				});
			});

			// Increment quantity
			elementCheckByElementClass('.cart-item-container:first')
				.find('.cart-item-quantity-button-increment')
				.scrollIntoView()
				.click();

			// check if update complete
			elementCheckByElementClass('.checkout-now-button', {
					beVisible: true,
					disabled: false
			});

			// TODO: looks like the loading states are not exactly matching up. So i still gotta timeout
			// BUG: race condition. Without wait, its possible that the totals will not match up
			cy.wait(3000);

			// Increment quantity
			elementCheckByElementClass('.cart-item-container:last')
				.find('.cart-item-quantity-button-increment')
				.scrollIntoView()
				.click();

			// check if update complete
			elementCheckByElementClass('.checkout-now-button', {
					beVisible: true,
					disabled: false
			});

			// TODO: looks like the loading states are not exactly matching up. So i still gotta timeout
			// BUG: race condition. Without wait, its possible that the totals will not match up
			cy.wait(3000);

			// get updated values
			// first element ---------------------------------------------------------------
			elementCheckByElementClass('.cart-item-container:first', {
				findByChild: '.line-item-unit-price',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_price_first_updated');

			elementCheckByElementClass('.cart-item-container:first', {
				findByChild: '.cart-item-quantity-display',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_quantity_first_updated');

			elementCheckByElementClass('.cart-item-container:first', {
				findByChild: '.line-item-price',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_subtotal_first_updated');

			// second element ---------------------------------------------------------------// first element ---------------------------------------------------------------
			elementCheckByElementClass('.cart-item-container:last', {
				findByChild: '.line-item-unit-price',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_price_second_updated');

			elementCheckByElementClass('.cart-item-container:first', {
				findByChild: '.cart-item-quantity-display',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_quantity_second_updated');

			elementCheckByElementClass('.cart-item-container:first', {
				findByChild: '.line-item-price',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_subtotal_second_updated');

			cy.get('.cart-totals-subtotal').invoke('text').then(text => parseFloat(text.trim())).as('cart_subtotal_updated');
			cy.get('.cart-totals-shipping').invoke('text').then(text => parseFloat(text.trim())).as('cart_shipping_updated');
			cy.get('.cart-totals-total').invoke('text').then(text => parseFloat(text.trim())).as('cart_total_updated');

			cy.get('@unit_price_first_updated').then(unit_price_first_updated => {
				cy.get('@unit_quantity_first_updated').then(unit_quantity_first_updated => {
					cy.get('@unit_price_second_updated').then(unit_price_second_updated => {
						cy.get('@unit_quantity_second_updated').then(unit_quantity_second_updated => {
							cy.get('@cart_subtotal_updated').then(cart_subtotal_updated => {
								cy.get('@cart_shipping_updated').then(cart_shipping_updated => {
									cy.get('@cart_total_updated').then(cart_total_updated => {
										const calc_subtotal_first_updated = unit_price_first_updated * unit_quantity_first_updated;
										const calc_subtotal_second_updated = unit_price_second_updated * unit_quantity_second_updated;
										const calc_subtotal_updated = calc_subtotal_first_updated + calc_subtotal_second_updated;
										expect(calc_subtotal_updated).to.equal(cart_subtotal_updated);
										expect(calc_subtotal_updated + cart_shipping_updated).to.equal(cart_total_updated);
									});
								});
							});
						});
					});
				});
			});
			
	});
});