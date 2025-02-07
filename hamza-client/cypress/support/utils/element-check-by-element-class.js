export function elementCheckByElementClass(findBy, emptyShould = false) {
    return emptyShould
        ? cy.get(findBy, { timeout: 10000 })
        : cy.get(findBy, { timeout: 10000 }).should('be.visible');
}
