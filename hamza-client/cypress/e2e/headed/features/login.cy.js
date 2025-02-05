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

    //open user menu
    cy.get('.account-menu-button').click();

    // cy.wait(3000); // Wait 3 seconds before continuing

    cy.get('.account-profile-link', { timeout: 10000 })
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
                        reject(new Error('Profile link not visible after 10 seconds'));
                    } else {
                        setTimeout(check, 2000);
                    }
                };
                check();
            });
        })
        .click();
    
    cy.contains('Personal Information', { timeout: 10000 })
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
                        reject(new Error('Personal Information not visible after 10 seconds'));
                    } else {
                        setTimeout(check, 2000);
                    }
                };
                check();
            });
        });
  });
});