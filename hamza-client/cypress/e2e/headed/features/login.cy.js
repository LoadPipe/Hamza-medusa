import { buttonClickByElementClass } from '../../../support/utils/buttons/button-click-by-element-class';
import { elementCheckByElementText } from '../../../support/utils/element-check-by-element-text';
import { buttonClickByElementText } from '../../../support/utils/buttons/button-click-by-element-text';

describe('Metamask login then user profile', () => {
    beforeEach(() => {
        cy.visit('/en');
    });

    it('should connect wallet and display account information', () => {
        buttonClickByElementText('Connect Wallet');

        // Simulate wallet selection (MetaMask in this case)
        cy.get('body').then(($body) => {
            if ($body.find('button:contains("MetaMask")').length) {
                buttonClickByElementText('MetaMask');
            }
        });

        buttonClickByElementText('Sign message');

        elementCheckByElementText('Verify your account', {
            exist: false,
            scrollIntoView: false,
            beVisible: false,
            timeout: 30000,
        });

        //open user menu
        buttonClickByElementClass('.account-menu-button');

        // cy.wait(3000); // Wait 3 seconds before continuing

        buttonClickByElementClass('.account-profile-link');

        elementCheckByElementText('Personal Information', {
            exist: true,
            scrollIntoView: true,
            beVisible: true,
            timeout: 50000,
        });
    });
});
