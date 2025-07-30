import { buttonClickByElementClass } from '../../../support/utils/buttons/button-click-by-element-class';
import { connectWallet } from '../../../support/utils/buttons/connect-wallet';
import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';

describe('Home page switch currency', () => {
    beforeEach(() => {
        cy.visit('/en');
    });

    it('should switch currency', () => {
        //open currency selector and select USDC
        buttonClickByElementClass('.nav-currency-selector-desktop');

        // TODO: odd behavior, element has zero height, so it's not visible, but it's clickable with forceClick
        // BUG: why does element have zero height?
        // Proper way: buttonClickByElementClass('.nav-currency-selector-desktop', { findByChild: 'USDC' });
        buttonClickByElementClass('.nav-currency-selector-desktop', {
            findByChild: 'USDC',
            beVisible: false,
            forceClick: true,
        });

        cy.wait(3000);

        elementCheckByElementClass('.product-card', {
            findByChild: 'USDC',
            scrollIntoView: false,
        });

        // //open currency selector and select ETH
        buttonClickByElementClass('.nav-currency-selector-desktop', {
            findByChild: 'USDC',
            beVisible: false,
            forceClick: true,
        });

        // TODO: odd behavior, element has zero height, so it's not visible, but it's clickable with forceClick
        // BUG: why does element have zero height?
        // Proper way: buttonClickByElementClass('.nav-currency-selector-desktop', { findByChild: 'ETH' });
        buttonClickByElementClass('.nav-currency-selector-desktop', {
            findByChild: 'ETH',
            beVisible: false,
            forceClick: true,
        });

        cy.wait(3000);

        elementCheckByElementClass('.product-card', {
            findByChild: 'ETH',
            scrollIntoView: false,
        });

        // //open currency selector and select USDT
        buttonClickByElementClass('.nav-currency-selector-desktop', {
            findByChild: 'USDC',
            beVisible: false,
            forceClick: true,
        });

        // TODO: odd behavior, element has zero height, so it's not visible, but it's clickable with forceClick
        // BUG: why does element have zero height?
        // Proper way: buttonClickByElementClass('.nav-currency-selector-desktop', { findByChild: 'USDT' });
        buttonClickByElementClass('.nav-currency-selector-desktop', {
            findByChild: 'USDT',
            beVisible: false,
            forceClick: true,
        });

        cy.wait(3000);

        elementCheckByElementClass('.product-card', {
            findByChild: 'USDT',
            scrollIntoView: false,
        });

        //open currency selector and select USDC
        buttonClickByElementClass('.nav-currency-selector-desktop', {
            findByChild: 'USDC',
            beVisible: false,
            forceClick: true,
        });

        // TODO: odd behavior, element has zero height, so it's not visible, but it's clickable with forceClick
        // BUG: why does element have zero height?
        // Proper way: buttonClickByElementClass('.nav-currency-selector-desktop', { findByChild: 'USDC' });
        buttonClickByElementClass('.nav-currency-selector-desktop', {
            findByChild: 'USDC',
            beVisible: false,
            forceClick: true,
        });

        cy.wait(3000);

        elementCheckByElementClass('.product-card', {
            findByChild: 'USDC',
            scrollIntoView: false,
        });
    });
});
