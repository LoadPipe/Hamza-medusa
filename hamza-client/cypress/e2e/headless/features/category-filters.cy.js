import { elementCheckByElementText } from '../../../support/utils/element-check-by-element-text';
import { elementCheckByElementClass } from '../../../support/utils/element-check-by-element-class';
import { buttonClickByElementClass } from '../../../support/utils/buttons/button-click-by-element-class';

describe('Category filters', () => {
    it('Default all single filters', () => {
        cy.visit('/en');

        // default all check
        elementCheckByElementClass('.product-cards .product-card', {
            scrollIntoView: false,
        }).should('have.length', 24);

        // single filter check: home
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'All',
            isVisible: false,
            forceClick: true,
        });
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Home',
            isVisible: false,
            forceClick: true,
        });

        elementCheckByElementClass('.product-cards .product-card', {
            scrollIntoView: false,
        }).should('have.length', 6);

        // single filter check: electronics
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Home',
            isVisible: false,
            forceClick: true,
        });
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Electronics',
            isVisible: false,
            forceClick: true,
        });

        elementCheckByElementClass('.product-cards .product-card', {
            scrollIntoView: false,
        }).should('have.length', 9);

        // buttonClickByElementClass('.filter-bar', { findByChild: '.filter-bar-chevron' });

        // single filter check: electronics
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Electronics',
            isVisible: false,
        });
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Gaming',
            isVisible: false,
        });

        elementCheckByElementClass('.product-cards .product-card', {
            scrollIntoView: false,
        }).should('have.length', 16);

        // single filter check: fashion
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Gaming',
            isVisible: false,
            forceClick: true,
        });
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Fashion',
            isVisible: false,
            forceClick: true,
        });

        elementCheckByElementClass('.product-cards .product-card', {
            scrollIntoView: false,
        }).should('have.length', 6);

        buttonClickByElementClass('.filter-bar', {
            findByChild: '.filter-bar-chevron',
            isVisible: false,
            forceClick: true,
        });

        // single filter check: Featured
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Fashion',
            isVisible: false,
            forceClick: true,
        });
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Featured',
            isVisible: false,
            forceClick: true,
        });

        elementCheckByElementClass('.product-cards .product-card', {
            scrollIntoView: false,
        }).should('have.length', 3);

        // single filter check: Hobbies
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Featured',
            isVisible: false,
            forceClick: true,
        });
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Hobbies',
            isVisible: false,
            forceClick: true,
        });

        elementCheckByElementClass('.product-cards .product-card', {
            scrollIntoView: false,
        }).should('have.length', 10);

        // single filter check: Fitness
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Hobbies',
            isVisible: false,
            forceClick: true,
        });
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Fitness',
            isVisible: false,
            forceClick: true,
        });

        elementCheckByElementClass('.product-cards .product-card', {
            scrollIntoView: false,
        }).should('have.length', 9);

        buttonClickByElementClass('.filter-bar', {
            findByChild: '.filter-bar-chevron',
            isVisible: false,
            forceClick: true,
        });

        // single filter check: Board Games
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Fitness',
            isVisible: false,
            forceClick: true,
        });
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Board Games',
            isVisible: false,
            forceClick: true,
        });

        elementCheckByElementClass('.product-cards .product-card', {
            scrollIntoView: false,
        }).should('have.length', 9);
    });

    it('Multi filters: home and electronics', () => {
        cy.visit('/en');

        // home and electronics
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'All',
            isVisible: false,
            forceClick: true,
        });
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Home',
            isVisible: false,
            forceClick: true,
        });
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Electronics',
            isVisible: false,
            forceClick: true,
        });

        elementCheckByElementClass('.product-cards .product-card', {
            scrollIntoView: false,
        }).should('have.length', 15);
    });

    it('Multi filters: electronics and gaming', () => {
        cy.visit('/en');

        // home and electronics
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'All',
            isVisible: false,
            forceClick: true,
        });
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Electronics',
            isVisible: false,
            forceClick: true,
        });
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Gaming',
            isVisible: false,
            forceClick: true,
        });

        elementCheckByElementClass('.product-cards .product-card', {
            scrollIntoView: false,
        }).should('have.length', 24);
    });

    it('Filter modal: Electronics and Gaming', () => {
        cy.visit('/en');

        // open filter modal
        buttonClickByElementClass('.filter-bar', {
            findByChild: 'Filter',
            isVisible: false,
            forceClick: true,
        });

        // wait till modal opens
        elementCheckByElementClass('.filter-modal', { isVisible: true });

        // electronics and gaming
        buttonClickByElementClass('.filter-modal', {
            findByChild: 'Electronics',
            isVisible: false,
            forceClick: true,
        });
        buttonClickByElementClass('.filter-modal', {
            findByChild: 'Gaming',
            isVisible: false,
            forceClick: true,
        });

        // click apply filters
        buttonClickByElementClass('.filter-modal', {
            findByChild: 'Apply Filters',
            isVisible: false,
            forceClick: true,
        });

        elementCheckByElementClass('.product-cards .product-card', {
            scrollIntoView: false,
        }).should('have.length', 24);
    });

    // TODO: implement drag and drop for price range
    // it('Filter modal: Price range', () => {
    // 	cy.visit('/en');

    // 	// open filter modal
    // 	buttonClickByElementClass('.filter-bar', { findByChild: 'Filter', isVisible: false, forceClick: true });

    // 	// wait till modal opens
    // 	elementCheckByElementClass('.filter-modal', { isVisible: true });

    // 	// Drag price range slider thumb to the right
    // 	cy.get('.filter-modal .range-slider-thumb-right')
    // 		.trigger('mousedown')
    // 		.trigger('mousemove', { clientX: 20, force: true })
    // 		.trigger('mouseup', { force: true });

    // });
});
