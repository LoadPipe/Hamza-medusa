describe('Headless Combined Tests', () => {
    //features
    require('./headless/features/add-to-cart-multi-product.cy.js');
    require('./headless/features/add-to-cart-multi-variant-type.cy.js');
    require('./headless/features/add-to-cart-single-variant-type.cy.js');
    require('./headless/features/cart-multi-item-totals.cy.js');
    require('./headless/features/cart-single-item-totals.cy.js');
    require('./headless/features/category-filters.cy.js');
    require('./headless/features/currency-switch.cy.js');
    require('./headless/features/remove-from-cart.cy.js');
    require('./headless/features/search.cy.js');

    //pages
    require('./headless/pages/home.cy.js');
    require('./headless/pages/product-details.cy.js');
    require('./headless/pages/store.cy.js');

    //redirects
    require('./headless/home-redirect.cy.js');
});
