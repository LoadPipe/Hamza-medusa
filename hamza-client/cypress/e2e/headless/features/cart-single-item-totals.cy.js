import { elementCheckByElementText } from '../../../support/utils/element-check-by-element-text';	
import { buttonClickByElementText } from '../../../support/utils/buttons/button-click-by-element-text';
import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';

// Add these helper functions before the describe block

describe('Product page exist [t-shirt]', () => {
	it('adds 1 item to cart and checks cart totals', () => {
			// Tshirt
			cy.visit('/en/products/t-shirt');

			buttonClickByElementText('Add to Cart');

			// Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
			elementCheckByElementText('Added to Cart');

			// Check for cart totals
			cy.visit('/en/cart');

			// Get initial values and wait for them to resolve
			elementCheckByElementClass('.cart-item-container', {
				findByChild: '.line-item-unit-price',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_price');

			elementCheckByElementClass('.cart-item-container', {
				findByChild: '.cart-item-quantity-display',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_quantity');

			elementCheckByElementClass('.cart-item-container', {
				findByChild: '.line-item-price',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_subtotal');

			cy.get('.cart-totals-subtotal').invoke('text').then(text => parseFloat(text.trim())).as('cart_subtotal');
			cy.get('.cart-totals-shipping').invoke('text').then(text => parseFloat(text.trim())).as('cart_shipping');
			cy.get('.cart-totals-total').invoke('text').then(text => parseFloat(text.trim())).as('cart_total');

			cy.get('@unit_price').then(unit_price => {
				cy.get('@unit_quantity').then(unit_quantity => {
					cy.get('@cart_subtotal').then(cart_subtotal => {
						cy.get('@cart_shipping').then(cart_shipping => {
							cy.get('@cart_total').then(cart_total => {
								const calc_subtotal = unit_price * unit_quantity;
								expect(calc_subtotal).to.equal(cart_subtotal);
								expect(calc_subtotal + cart_shipping).to.equal(cart_total);
							});
						});
					});
				});
			});

			// Increment quantity
			elementCheckByElementClass('.cart-item-container')
				.find('.cart-item-quantity-button-increment')
				.scrollIntoView()
				.click();

			// check if update complete
			elementCheckByElementClass('.checkout-now-button', {
					beVisible: true,
					disabled: false
			});

			// get updated values
			elementCheckByElementClass('.cart-item-container', {
				findByChild: '.line-item-unit-price',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_price2');

			elementCheckByElementClass('.cart-item-container', {
				findByChild: '.cart-item-quantity-display',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_quantity2');

			elementCheckByElementClass('.cart-item-container', {
				findByChild: '.line-item-price',
			}).invoke('text').then(text => parseFloat(text.trim())).as('unit_subtotal2');
			
			cy.get('.cart-totals-subtotal').invoke('text').then(text => parseFloat(text.trim())).as('cart_subtotal2');
			cy.get('.cart-totals-shipping').invoke('text').then(text => parseFloat(text.trim())).as('cart_shipping2');
			cy.get('.cart-totals-total').invoke('text').then(text => parseFloat(text.trim())).as('cart_total2');

			cy.get('@unit_price2').then(unit_price2 => {
				cy.get('@unit_quantity2').then(unit_quantity2 => {
					cy.get('@cart_subtotal2').then(cart_subtotal2 => {
						cy.get('@cart_shipping2').then(cart_shipping2 => {
							cy.get('@cart_total2').then(cart_total2 => {
								const calc_subtotal = unit_price2 * unit_quantity2;
								expect(calc_subtotal).to.equal(cart_subtotal2);
								expect(calc_subtotal + cart_shipping2).to.equal(cart_total2);
							});
						});
					});
				});
			});
			
	});
});