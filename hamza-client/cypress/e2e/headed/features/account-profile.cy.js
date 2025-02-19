import { connectWallet } from '../../../support/utils/buttons/connect-wallet';
import { buttonClickByElementText } from '../../../support/utils/buttons/button-click-by-element-text';
import { elementCheckByElementText } from '../../../support/utils/element-check-by-element-text';
import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';

describe('Account Profile', () => {
    beforeEach(() => {
        cy.visit('/en');
    });

    it('Update first name and refresh page', () => {
        connectWallet();

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

        cy.visit('/en/account/profile');

        cy.wait(3000);

        elementCheckByElementClass('.first-name-input', {
            findByChild: 'input',
        }).type('John');
        buttonClickByElementText('Update');
        cy.wait(1000);
        cy.reload();
        elementCheckByElementClass('.first-name-input', {
            findByChild: 'input',
        }).should('have.value', 'John');
    });

    it('Update last name and refresh page', () => {
        connectWallet();

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

        cy.visit('/en/account/profile');

        elementCheckByElementClass('.last-name-input', {
            findByChild: 'input',
        }).type('Doe');
        buttonClickByElementText('Update');
        cy.wait(1000);
        cy.reload();
        elementCheckByElementClass('.last-name-input', {
            findByChild: 'input',
        }).should('have.value', 'Doe');
    });
});
