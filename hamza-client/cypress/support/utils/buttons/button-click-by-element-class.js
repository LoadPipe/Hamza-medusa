// findBy is the class or id of the button
export function buttonClickByElementClass(findBy, emptyShould = false) {
    return emptyShould
        ? cy.get(findBy, { timeout: 10000 }).click()
        : cy.get(findBy, { timeout: 10000 }).should('be.visible').click();
}
