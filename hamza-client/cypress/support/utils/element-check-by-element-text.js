export function elementCheckByElementText(findBy, emptyShould = false) {
    return emptyShould
        ? cy.contains(findBy, { timeout: 10000 })
        : cy.contains(findBy, { timeout: 10000 }).should('be.visible');
}
