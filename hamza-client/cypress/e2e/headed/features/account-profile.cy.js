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

        cy.visit('/en/account/profile');

        cy.wait(3000);

        elementCheckByElementClass('.first-name-input input', {
            timeout: 30000,
        })
            .clear()
            .type('John');
        buttonClickByElementText('Update');
        cy.wait(1000);
        cy.reload();

        cy.wait(3000);

        elementCheckByElementClass('.first-name-input input', {
            timeout: 30000,
        }).should('have.value', 'John');
    });

    it('Update last name and refresh page', () => {
        connectWallet();

        cy.visit('/en/account/profile');

        elementCheckByElementClass('.last-name-input input', {
            timeout: 30000,
        })
            .clear()
            .type('Doe');
        buttonClickByElementText('Update');
        cy.wait(1000);
        cy.reload();

        cy.wait(3000);

        elementCheckByElementClass('.last-name-input input', {
            timeout: 30000,
        }).should('have.value', 'Doe');
    });
});
