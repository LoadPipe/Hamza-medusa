import { buttonClickByElementText } from '../../../support/utils/buttons/button-click-by-element-text';
import { elementCheckByElementText } from '../../../support/utils/element-check-by-element-text';
import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';
import { buttonClickByElementClass } from '../../../support/utils/buttons/button-click-by-element-class';
describe('Add to cart single variant type', () => {
    it('fetches product with handle [t-shirt]', () => {
        cy.visit('/en/products/t-shirt');
        cy.wait(2000); // Wait for page to fully load
        elementCheckByElementText('Medusa T-Shirt');
    });

    it('adds single product to the cart', () => {
        cy.visit('/en/products/t-shirt');

        buttonClickByElementText('Add to Cart');

        // Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
        elementCheckByElementText('Added to Cart');
    });

    it('adds 3 quantity to the cart', () => {
        cy.visit('/en/products/t-shirt');

        // TODO: Since zustand store is used, testing this is more tricky.
        // cy.wait(3000);

        // // checks plus and minus functionality
        // for (let i = 0; i < 3; i++) {
        //     cy.get('.quantity-button-increment').click();
        //     cy.wait(3000);
        // }

        // cy.get('.quantity-button-decrement').click();

        // cy.wait(3000);

        // // check quantity is 3
        // cy.get('.quantity-display').should('have.text', '3');

        // cy.wait(3000);

        // adds 1st to cart
        buttonClickByElementText('Add to Cart');

        // Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
        elementCheckByElementText('Added to Cart');

        // click on "continue shopping"
        buttonClickByElementText('Continue Shopping');
            

        // adds 2nd to cart
        buttonClickByElementText('Add to Cart');

        // Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
        elementCheckByElementText('Added to Cart');

        // click on "continue shopping"
        buttonClickByElementText('Continue Shopping');

        // adds 3rd to cart
        buttonClickByElementText('Add to Cart');

        // Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
        elementCheckByElementText('Added to Cart');

        // click on "continue shopping"
        buttonClickByElementText('Continue Shopping');
            
        // checks cart quantity in nav
        elementCheckByElementClass('.cart-quantity', {
			findByChild: '3'
		});

        cy.wait(3000);

        // cart check
        cy.visit('/en/cart');

        cy.wait(3000);

        elementCheckByElementClass('.cart-item-container', {
			findByChild: 'Medusa T-Shirt'
		});
        
        elementCheckByElementClass('.cart-item-quantity-display', {
			findByChild: '3'
		});

        // test cart increment and decrement
        buttonClickByElementClass('.cart-item-container', {
            findByChild: '.cart-item-quantity-button-decrement',
            scrollIntoView: true,
        });
        
        elementCheckByElementClass('.checkout-now-button', {
            beVisible: true,
            disabled: false
        });

        // TODO: After checkout re-enables, the quantity still hasn't updated correctly.
        // BUG: Race condition?
        cy.wait(3000);
        elementCheckByElementClass('.cart-item-quantity-display', {
            findByChild: '2'
        });

        buttonClickByElementClass('.cart-item-container', {
            findByChild: '.cart-item-quantity-button-increment',
            scrollIntoView: true,
        });
            
        elementCheckByElementClass('.checkout-now-button', {
            beVisible: true,
            disabled: false,
        });
            
        elementCheckByElementClass('.cart-item-quantity-display', {
            findByChild: '3'
        });
    });

    it('adds a product to the cart and checks cart', () => {
        cy.visit('/en/products/t-shirt');

        buttonClickByElementText('Add to Cart');

        // Check for modal popup with "Added to Cart" text, retry 3 times with 4s intervals
        elementCheckByElementText('Added to Cart');

        cy.visit('/en/cart');
        elementCheckByElementText('Medusa T-Shirt');
    });
});
