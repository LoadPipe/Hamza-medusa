import { elementCheckByElementText } from '../element-check-by-element-text';
import { buttonClickByElementText } from './button-click-by-element-text';

export function connectWallet() {
    //connect wallet button
    // cy.get('button')
    // 	.contains('Connect Wallet', { timeout: 10000 })
    // 	.should('be.visible')
    // 	.should((elem) => {
    // 		return new Cypress.Promise((resolve, reject) => {
    // 			let attempts = 0;
    // 			const maxAttempts = 5; // 10 seconds total with 2s intervals
    // 			const check = () => {
    // 				attempts++;
    // 				if (Cypress.$(elem).is(':visible')) {
    // 					resolve();
    // 				} else if (attempts >= maxAttempts) {
    // 					reject(new Error('Connect Wallet button not visible after 10 seconds'));
    // 				} else {
    // 					setTimeout(check, 2000);
    // 				}
    // 			};
    // 			check();
    // 		});
    // 	})
    // 	.click();

    cy.get('button')
        .contains('Connect Wallet', { timeout: 10000 })
        .scrollIntoView()
        .should('be.visible')
        .click();

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
}
