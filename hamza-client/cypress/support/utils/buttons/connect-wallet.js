import { elementCheckByElementText } from '../element-check-by-element-text';
import { buttonClickByElementText } from './button-click-by-element-text';

export function connectWallet() {
    cy.get('button')
        .contains('Connect Wallet', { timeout: 10000 })
        .scrollIntoView()
        .should('be.visible')
        .click();

    cy.wait(2000);

    // Simulate wallet selection (MetaMask in this case)
    cy.get('body').then(($body) => {
        if ($body.find('button:contains("MetaMask")').length) {
            buttonClickByElementText('MetaMask');
        }
    });

    cy.wait(2000);

    buttonClickByElementText('Sign message');

    elementCheckByElementText('Verify your account', {
        exist: false,
        scrollIntoView: false,
        beVisible: false,
        timeout: 30000,
    });
}
