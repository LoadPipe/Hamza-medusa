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

    cy.contains('button', 'USDC').click();

		cy.wait(3000);

		cy.contains('button', 'Save Changes').click();

		cy.wait(3000);

    cy.get('.product-card').find('span').contains('USDC').should('exist');

		// //open currency selector and select ETH
    cy.get('.currency-selector').click();

    cy.contains('button', 'ETH').click();

		cy.wait(3000);

		cy.contains('button', 'Save Changes').click();

		cy.wait(3000);

		cy.get('.product-card').find('span').contains('ETH').should('exist');

		// //open currency selector and select USDT
    cy.get('.currency-selector').click();

    cy.contains('button', 'USDT').click();

		cy.wait(3000);

		cy.contains('button', 'Save Changes').click();

		cy.wait(3000);

		cy.get('.product-card').find('span').contains('USDT').should('exist');

		//open currency selector and select USDC
    cy.get('.currency-selector').click();

    cy.contains('button', 'USDC').click();

		cy.wait(3000);

		cy.contains('button', 'Save Changes').click();

		cy.wait(3000);

    cy.get('.product-card').find('span').contains('USDC').should('exist');
  });
});