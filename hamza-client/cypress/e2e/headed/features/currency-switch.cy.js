import { buttonClickByElementClass } from '../../../support/utils/buttons/button-click-by-element-class';
import { connectWallet } from '../../../support/utils/buttons/connect-wallet';
import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';
import { buttonClickByElementText } from '../../../support/utils/buttons/button-click-by-element-text';
import { elementCheckByElementText } from '../../../support/utils/element-check-by-element-text';

describe('Metamask login then user profile', () => {
    beforeEach(() => {
        cy.visit('/en');
    });

    it('should connect wallet and display account information', () => {
        connectWallet();

        //open currency selector and select USDC
        buttonClickByElementClass('.currency-selector');

        // TODO: odd behavior, element has zero height, so it's not visible, but it's clickable with forceClick
        // BUG: why does element have zero height?
        // Proper way: buttonClickByElementClass('.currency-selector-item', { findByChild: 'USDC' });
        buttonClickByElementClass('.currency-selector-item', {
            findByChild: 'USDC',
            beVisible: false,
            forceClick: true,
        });

        cy.wait(3000);

        buttonClickByElementText('Save Changes');

        cy.wait(3000);

        elementCheckByElementClass('.product-card', {
            findByChild: 'USDC',
            scrollIntoView: false,
        });

        // //open currency selector and select ETH
        buttonClickByElementClass('.currency-selector');

        // TODO: odd behavior, element has zero height, so it's not visible, but it's clickable with forceClick
        // BUG: why does element have zero height?
        // Proper way: buttonClickByElementClass('.currency-selector-item', { findByChild: 'ETH' });
        buttonClickByElementClass('.currency-selector-item', {
            findByChild: 'ETH',
            beVisible: false,
            forceClick: true,
        });

        cy.wait(3000);

        buttonClickByElementText('Save Changes');

        cy.wait(3000);

        elementCheckByElementClass('.product-card', {
            findByChild: 'ETH',
            scrollIntoView: false,
        });

        // //open currency selector and select USDT
        buttonClickByElementClass('.currency-selector');

        // TODO: odd behavior, element has zero height, so it's not visible, but it's clickable with forceClick
        // BUG: why does element have zero height?
        // Proper way: buttonClickByElementClass('.currency-selector-item', { findByChild: 'USDT' });
        buttonClickByElementClass('.currency-selector-item', {
            findByChild: 'USDT',
            beVisible: false,
            forceClick: true,
        });

        cy.wait(3000);

        buttonClickByElementText('Save Changes');

        cy.wait(3000);

        elementCheckByElementClass('.product-card', {
            findByChild: 'USDT',
            scrollIntoView: false,
        });

        //open currency selector and select USDC
        buttonClickByElementClass('.currency-selector');

        // TODO: odd behavior, element has zero height, so it's not visible, but it's clickable with forceClick
        // BUG: why does element have zero height?
        // Proper way: buttonClickByElementClass('.currency-selector-item', { findByChild: 'USDC' });
        buttonClickByElementClass('.currency-selector-item', {
            findByChild: 'USDC',
            beVisible: false,
            forceClick: true,
        });

        cy.wait(3000);

        buttonClickByElementText('Save Changes');

        cy.wait(3000);

        elementCheckByElementClass('.product-card', {
            findByChild: 'USDC',
            scrollIntoView: false,
        });
    });
});
