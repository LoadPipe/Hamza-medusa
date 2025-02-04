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

    cy.get('.account-profile-link').click();   
    
    cy.contains('Personal Information').should('exist');
  });
});