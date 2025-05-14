import { connectWallet } from '../../../support/utils/buttons/connect-wallet';
import { buttonClickByElementText } from '../../../support/utils/buttons/button-click-by-element-text';
import { buttonClickByElementClass } from '../../../support/utils/buttons/button-click-by-element-class';
import { elementCheckByElementText } from '../../../support/utils/element-check-by-element-text';
import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';

describe('Checkout Address', () => {
    beforeEach(() => {
        cy.visit('/en');
    });

    it('Add or edit shipping address 1', () => {
        connectWallet();

        cy.wait(3000);

        cy.visit('/en/checkout');

        buttonClickByElementText(/(Add|Edit) Shipping Address/);

        cy.wait(2000);

        elementCheckByElementClass('input[name="shipping_address.first_name"]')
            .clear()
            .type('John');

        elementCheckByElementClass('input[name="shipping_address.last_name"]')
            .clear()
            .type('Doe');

        elementCheckByElementClass('input[name="shipping_address.address_1"]')
            .clear()
            .type('123 Main St');

        elementCheckByElementClass('input[name="shipping_address.address_2"]')
            .clear()
            .type('ABC Building');

        elementCheckByElementClass('input[name="shipping_address.city"]')
            .clear()
            .type('New York City');

        elementCheckByElementClass('input[name="shipping_address.province"]')
            .clear()
            .type('New York State');

        elementCheckByElementClass('input[name="shipping_address.postal_code"]')
            .clear()
            .type('10001');

        elementCheckByElementClass('input[name="shipping_address.phone"]')
            .clear()
            .type('12341234');

        elementCheckByElementClass(
            'select[name="shipping_address.country_code"]'
        ).select('Canada');

        elementCheckByElementClass('input[name="email"]')
            .clear()
            .type('test@test.com');

        buttonClickByElementText(/(Add|Edit) Address/);

        cy.wait(2000);

        //validate data
        elementCheckByElementText('John Doe');
        elementCheckByElementText('123 Main St');
        elementCheckByElementText('ABC Building');
        elementCheckByElementText('New York City');
        elementCheckByElementText('New York State');
        elementCheckByElementText('10001');
        elementCheckByElementText('12341234');
        elementCheckByElementText('CA');
        elementCheckByElementText('test@test.com');
    });

    it('Add or edit shipping address 2', () => {
        connectWallet();

        cy.wait(3000);

        cy.visit('/en/checkout');

        buttonClickByElementText(/(Add|Edit) Shipping Address/);

        cy.wait(2000);

        elementCheckByElementClass('input[name="shipping_address.first_name"]')
            .clear()
            .type('Jane');

        elementCheckByElementClass('input[name="shipping_address.last_name"]')
            .clear()
            .type('Doe');

        elementCheckByElementClass('input[name="shipping_address.address_1"]')
            .clear()
            .type('456 Second St');

        elementCheckByElementClass('input[name="shipping_address.address_2"]')
            .clear()
            .type('DEF Awesome Building');

        elementCheckByElementClass('input[name="shipping_address.city"]')
            .clear()
            .type('Los Angeles');

        elementCheckByElementClass('input[name="shipping_address.province"]')
            .clear()
            .type('California');

        elementCheckByElementClass('input[name="shipping_address.postal_code"]')
            .clear()
            .type('90038');

        elementCheckByElementClass('input[name="shipping_address.phone"]')
            .clear()
            .type('1234567890');

        elementCheckByElementClass(
            'select[name="shipping_address.country_code"]'
        ).select('United States');

        elementCheckByElementClass('input[name="email"]')
            .clear()
            .type('test2@whatever.com');

        buttonClickByElementText(/(Add|Edit|Save) Address/);

        cy.wait(2000);

        //validate data
        elementCheckByElementText('Jane Doe');
        elementCheckByElementText('456 Second St');
        elementCheckByElementText('DEF Awesome Building');
        elementCheckByElementText('Los Angeles');
        elementCheckByElementText('California');
        elementCheckByElementText('90038');
        elementCheckByElementText('1234567890');
        elementCheckByElementText('US');
        elementCheckByElementText('test2@whatever.com');
    });

    it('Save shipping address 2, edit address and save new address', () => {
        connectWallet();

        cy.wait(3000);

        cy.visit('/en/checkout');

        buttonClickByElementText(/(Add|Edit) Shipping Address/);

        cy.wait(2000);

        buttonClickByElementClass('.save-address-checkbox span', {
            forceClick: true,
        });

        buttonClickByElementText(/(Add|Edit|Save) Address/);

        cy.wait(2000);

        // save 2nd address
        buttonClickByElementText(/(Add|Edit) Shipping Address/);

        cy.wait(2000);

        elementCheckByElementClass('input[name="shipping_address.first_name"]')
            .clear()
            .type('John');

        elementCheckByElementClass('input[name="shipping_address.last_name"]')
            .clear()
            .type('Doe');

        elementCheckByElementClass('input[name="shipping_address.address_1"]')
            .clear()
            .type('123 Main St');

        elementCheckByElementClass('input[name="shipping_address.address_2"]')
            .clear()
            .type('ABC Building');

        elementCheckByElementClass('input[name="shipping_address.city"]')
            .clear()
            .type('New York City');

        elementCheckByElementClass('input[name="shipping_address.province"]')
            .clear()
            .type('New York State');

        elementCheckByElementClass('input[name="shipping_address.postal_code"]')
            .clear()
            .type('10001');

        elementCheckByElementClass('input[name="shipping_address.phone"]')
            .clear()
            .type('12341234');

        elementCheckByElementClass(
            'select[name="shipping_address.country_code"]'
        ).select('Canada');

        elementCheckByElementClass('input[name="email"]')
            .clear()
            .type('test@test.com');

        buttonClickByElementClass('.save-address-checkbox span', {
            forceClick: true,
        });

        cy.wait(2000);

        buttonClickByElementText(/(Add|Edit|Save) Address/);
    });
});
