import { elementCheckByElementText } from '../element-check-by-element-text';
import { buttonClickByElementText } from './button-click-by-element-text';

export function connectWallet() {
    cy.get('button')
        .contains('Connect Wallet', { timeout: 10000 })
        .scrollIntoView()
        .should('be.visible')
        .click();

    // Display message for manual MetaMask login
    cy.log(
        '🦊 MANUAL ACTION REQUIRED: Please connect and sign in to your MetaMask wallet manually'
    );
    cy.window().then((win) => {
        alert(
            '🦊 MANUAL ACTION REQUIRED: Please connect and sign in to your MetaMask wallet manually. Click OK when done.'
        );
    });

    // Wait for user to complete manual MetaMask connection
    cy.wait(5000); // Give user 15 seconds to connect manually

    elementCheckByElementText('Verify your account', {
        exist: false,
        scrollIntoView: false,
        beVisible: false,
        timeout: 30000,
    });
}
