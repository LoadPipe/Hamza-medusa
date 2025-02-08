// findBy is the class or id of the button
export function buttonClickByElementText(
    findBy,
    {
        findByChild = null,
        scrollIntoView = true,
        beVisible = true,
        exist = null,
        disabled = null,
        forceClick = false,
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
        cyContains.should('be.visible');
    }

    if (exist === true) {
        cyContains.should('exist');
    } else if (exist === false) {
        cyContains.should('not.exist');
    }

    if (disabled === true) {
        cyContains.should('be.disabled');
    } else if (disabled === false) {
        cyContains.should('not.be.disabled');
    }

    return forceClick ? cyContains.click({ force: true }) : cyContains.click();
}
