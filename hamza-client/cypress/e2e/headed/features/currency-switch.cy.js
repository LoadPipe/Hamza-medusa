describe('Metamask login then user profile', () => {
  beforeEach(() => {
    cy.visit("/en");
  });

  it('should connect wallet and display account information', () => {
    cy.contains("Connect Wallet").click(); // Click the RainbowKit button

    // Simulate wallet selection (MetaMask in this case)
    cy.contains("MetaMask").click();

    cy.contains("Sign message").click();

    cy.contains('Verify your account').should('not.exist');

    //open currency selector and select USDC
    cy.get('.currency-selector').click();

    cy.contains('.currency-selector-item', 'USDC', { timeout: 10000 })
        .should('be.visible')
        .should((elem) => {
            return new Cypress.Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 5; // 10 seconds total with 2s intervals
                const check = () => {
                    attempts++;
                    if (Cypress.$(elem).is(':visible')) {
                        resolve();
                    } else if (attempts >= maxAttempts) {
                        reject(new Error('USDC button not visible after 10 seconds'));
                    } else {
                        setTimeout(check, 2000);
                    }
                };
                check();
            });
        })
        .click();

		cy.wait(3000);

		cy.contains('button', 'Save Changes').click();

		cy.wait(3000);

    cy.get('.product-card').find('span').contains('USDC').should('exist');

		// //open currency selector and select ETH
    cy.get('.currency-selector').click();

    cy.contains('.currency-selector-item', 'ETH', { timeout: 10000 })
        .should('be.visible')
        .should((elem) => {
            return new Cypress.Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 5; // 10 seconds total with 2s intervals
                const check = () => {
                    attempts++;
                    if (Cypress.$(elem).is(':visible')) {
                        resolve();
                    } else if (attempts >= maxAttempts) {
                        reject(new Error('ETH button not visible after 10 seconds'));
                    } else {
                        setTimeout(check, 2000);
                    }
                };
                check();
            });
        })
        .click();

		cy.wait(3000);

		cy.contains('button', 'Save Changes').click();

		cy.wait(3000);

		cy.get('.product-card').find('span').contains('ETH').should('exist');

		// //open currency selector and select USDT
    cy.get('.currency-selector').click();

    cy.contains('.currency-selector-item', 'USDT', { timeout: 10000 })
        .should('be.visible')
        .should((elem) => {
            return new Cypress.Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 5; // 10 seconds total with 2s intervals
                const check = () => {
                    attempts++;
                    if (Cypress.$(elem).is(':visible')) {
                        resolve();
                    } else if (attempts >= maxAttempts) {
                        reject(new Error('USDT button not visible after 10 seconds'));
                    } else {
                        setTimeout(check, 2000);
                    }
                };
                check();
            });
        })
        .click();

		cy.wait(3000);

		cy.contains('button', 'Save Changes').click();

		cy.wait(3000);

		cy.get('.product-card').find('span').contains('USDT').should('exist');

		//open currency selector and select USDC
    cy.get('.currency-selector').click();

    cy.contains('.currency-selector-item', 'USDC', { timeout: 10000 })
        .should('be.visible')
        .should((elem) => {
            return new Cypress.Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 5; // 10 seconds total with 2s intervals
                const check = () => {
                    attempts++;
                    if (Cypress.$(elem).is(':visible')) {
                        resolve();
                    } else if (attempts >= maxAttempts) {
                        reject(new Error('USDC button not visible after 10 seconds'));
                    } else {
                        setTimeout(check, 2000);
                    }
                };
                check();
            });
        })
        .click();

		cy.wait(3000);

		cy.contains('button', 'Save Changes').click();

		cy.wait(3000);

    cy.get('.product-card').find('span').contains('USDC').should('exist');
  });
});