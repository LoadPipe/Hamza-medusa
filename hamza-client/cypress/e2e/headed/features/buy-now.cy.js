import { connectWallet } from '../../../support/utils/buttons/connect-wallet';
import { buttonClickByElementText } from '../../../support/utils/buttons/button-click-by-element-text';
import { elementCheckByElementText } from '../../../support/utils/element-check-by-element-text';

describe('Product page', () => {
    it('buy now for [t-shirt]', () => {
        cy.visit('/en/products/t-shirt');
        cy.wait(2000); // Wait for page to fully load
        elementCheckByElementText('Medusa T-Shirt');

        //buy now button
        buttonClickByElementText('Buy Now');

        connectWallet();

        elementCheckByElementText('Medusa T-Shirt');
    });
});
