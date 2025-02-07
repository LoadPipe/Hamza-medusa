// findBy is the class or id of the button
export function buttonClickByElementText(findBy, emptyShould = false) {
    return emptyShould
        ? cy.contains(findBy, { timeout: 10000 }).click()
        : cy.contains(findBy, { timeout: 10000 }).should('be.visible').click();
}
