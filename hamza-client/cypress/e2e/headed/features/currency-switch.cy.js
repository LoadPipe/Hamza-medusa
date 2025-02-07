import { buttonClickByElementClass } from '../../../support/utils/buttons/button-click-by-element-class';
import { connectWallet } from '../../../support/utils/buttons/connect-wallet';
import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';
import { buttonClickByElementText } from '../../../support/utils/buttons/button-click-by-element-text';
import { elementCheckByElementText } from '../../../support/utils/element-check-by-element-text';

describe('Metamask login then user profile', () => {
  beforeEach(() => {
    cy.visit("/en");
  });

  it('should connect wallet and display account information', () => {
    connectWallet();

    // Simulate wallet selection (MetaMask in this case)
    buttonClickByElementText('MetaMask');

    buttonClickByElementText('Sign message');

    elementCheckByElementText('Verify your account');

    //open currency selector and select USDC
    buttonClickByElementClass('.currency-selector');

    buttonClickByElementClass('.currency-selector-item:contains(USDC)');

    cy.wait(3000);

    buttonClickByElementText('Save Changes');

    cy.wait(3000);

    elementCheckByElementClass('.product-card:contains(USDC)');

		// //open currency selector and select ETH
    buttonClickByElementClass('.currency-selector');

    buttonClickByElementClass('.currency-selector-item:contains(ETH)');

    cy.wait(3000);

    buttonClickByElementText('Save Changes');

    cy.wait(3000);

    elementCheckByElementClass('.product-card:contains(ETH)');

		// //open currency selector and select USDT
    buttonClickByElementClass('.currency-selector');

    buttonClickByElementClass('.currency-selector-item:contains(USDT)');

    cy.wait(3000);

    buttonClickByElementText('Save Changes');

    cy.wait(3000);

    elementCheckByElementClass('.product-card:contains(USDT)');

    //open currency selector and select USDC
    buttonClickByElementClass('.currency-selector');

    buttonClickByElementClass('.currency-selector-item:contains(USDC)');

    cy.wait(3000);

    buttonClickByElementText('Save Changes');

    cy.wait(3000);

    elementCheckByElementClass('.product-card:contains(USDC)');
  });
});