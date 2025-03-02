export function elementCheckByElementText(
    findBy,
    {
        findByChild = null,
        scrollIntoView = true,
        beVisible = true,
        exist = null,
        disabled = null,
        timeout = 10000,
    } = {}
) {
    let cyContains = cy.contains(findBy, { timeout: timeout });

    if (findByChild) {
        cyContains =
            typeof findByChild === 'string' &&
            !findByChild.startsWith('.') &&
            !findByChild.startsWith('#')
                ? cyContains.contains(findByChild, { timeout: timeout })
                : cyContains.find(findByChild, { timeout: timeout });
    }

    if (scrollIntoView) {
        cyContains.scrollIntoView();
    }

    if (beVisible) {
        cyContains.should('be.visible', { timeout: timeout });
    }

    if (exist === true) {
        cyContains.should('exist', { timeout: timeout });
    } else if (exist === false) {
        cyContains.should('not.exist', { timeout: timeout });
    }

    if (disabled === true) {
        cyContains.should('be.disabled', { timeout: timeout });
    } else if (disabled === false) {
        cyContains.should('not.be.disabled', { timeout: timeout });
    }

    return cyContains;
}
