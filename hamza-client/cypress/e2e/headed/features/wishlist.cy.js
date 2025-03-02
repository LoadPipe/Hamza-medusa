import { connectWallet } from '../../../support/utils/buttons/connect-wallet';
import { buttonClickByElementText } from '../../../support/utils/buttons/button-click-by-element-text';
import { buttonClickByElementClass } from '../../../support/utils/buttons/button-click-by-element-class';
import { elementCheckByElementText } from '../../../support/utils/element-check-by-element-text';
import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';

describe('Wishlist', () => {
    beforeEach(() => {
        cy.visit('/en/products/lld_indout');
    });

    it('Add wall lamp to wishlist', () => {
        connectWallet();

        cy.wait(3000);

        buttonClickByElementClass('.product-info-header svg', {
            scrollIntoView: true,
            forceClick: true,
            timeout: 30000,
        });

        cy.wait(3000);

        elementCheckByElementClass('.wishlist-count', {
            findByChild: '1',
            timeout: 30000,
        });

        cy.visit('/en/account/wishlist');

        elementCheckByElementText('INDOOR/OUTDOOR WALL LAMP M - W100 X D4', {
            timeout: 30000,
        });

        buttonClickByElementText('Add to Cart');

        buttonClickByElementText('Continue Shopping', {
            timeout: 30000,
        });

        cy.wait(3000);

        elementCheckByElementClass('.cart-quantity', {
            findByChild: '1',
        });

        cy.visit('/en/cart');

        cy.wait(3000);

        elementCheckByElementText('INDOOR/OUTDOOR WALL LAMP M - W100 X D4', {
            timeout: 30000,
        });
    });
});
