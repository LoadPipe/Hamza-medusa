export function elementCheckByElementClass(
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
    let cyGet = cy.get(findBy, { timeout: timeout });

    if (findByChild) {
        cyGet =
            typeof findByChild === 'string' &&
            !findByChild.startsWith('.') &&
            !findByChild.startsWith('#')
                ? cyGet.contains(findByChild, { timeout: timeout })
                : cyGet.find(findByChild, { timeout: timeout });
    }

    // NOTE: since this is a class selector, if you retrieve many elements, you cannot use this.
    if (scrollIntoView) {
        cyGet.then($elements => {
            if ($elements.length === 1) {
                cyGet.scrollIntoView();
            } else {
                cy.log('Multiple elements found, skipping scrollIntoView');
            }
        });
    }

    if (beVisible) {
        cyGet.should('be.visible', { timeout: timeout });
    }

    if (exist === true) {
        cyGet.should('exist', { timeout: timeout });
    } else if (exist === false) {
        cyGet.should('not.exist', { timeout: timeout });
    }

    if (disabled === true) {
        cyGet.should('be.disabled', { timeout: timeout });
    } else if (disabled === false) {
        cyGet.should('not.be.disabled', { timeout: timeout });
    }

    return cyGet;
}
