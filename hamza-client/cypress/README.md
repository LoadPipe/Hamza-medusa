# Running Cypress Tests

## What Are Cypress Tests?

Consider these tests like they are actually mimicing the user experience. The tests are not "perfect", as they also suffer the consequences of slow server response time. If your local test server is a slower machine, there is greater likelihood for some tests to fail. Some tests have a limited time expectation for a certain response, and if that response isn't met (i.e. waited too long), the test will fail.

Consider these tests as a 1st test Around the application.

## Test Categories

All tests are split into headless and headed tests.

### Headless Tests

- Test on features without login
- Test can be ran on the command line
- Tests don't require a logged in browser or Metamask (all headed tests are based on pages that don't require metamask)

### Headed Tests

- Test on features with login
- Tests must be ran on the chrome browser (built-in)
- Tests require you to enable Metamask in chrome browser (built-in)
- Tests require you to login to Metamask

## Test Procedures

Its best to run these tests 2-3 times. Since these tests are hitting your local server, there are chances of some test to fail on slow machines. Consider testing in this order:

1. Run 2-3 command line tests
2. Mark down the tests that are failing
3. Run tests in GUI
4. Do manual test in browser to confirm bug/issue

In general, this will flush out some discovered bugs from implementation.

## Run Options

### Headless Tests

You can run tests on command line and/or using cypress's UI:

#### Command Line Options

- Run all headless tests:

    ```bash
    npm run e2e:chrome:headless
    ```

- Run a single file:

    ```bash
    npm run e2e:chrome:file "filename.cy.js"
    ```

    Example:

    ```bash
    npm run e2e:chrome:file "e2e/headless/features/search.cy.js"
    ```

- Run with graphic interface:
    ```bash
    npm run cypress
    ```

### Headed Tests

For headed tests, it's best to run tests with the graphic UI, as parts of the tests require metamask:

- Run with graphic interface:
    ```bash
    npm run cypress
    ```

#### Notes about headed test

Headed tests are not perfect. In order to implement the headed test, I opted for a semi-automated approach. Its not perfect, but I think helps document the tests that we should run, and could run through some general tests faster than doing it manually.

**Enable Metamask**: In order to work with metamask, you'll need to enable metamask in the test browser. When running tests, the test will get to a point where the browser will ask you for confirmation/login. I'd suggest before testing, login to your metamask account first. That will enable a smoother test.

# Writing Cypress Tests

Cypress tests are quite finicky, and as I was writing them, I decided to write some utility methods to help. They are not perfect, but in general work as expected in a relatively "predictable" manner.

To use these methods, you'll need to import them into your tests.

I have 5 utility methods:

connectWallet
buttonClickByElementClass
buttonClickByElementText
elementCheckByElementClass
elementCheckByElementText

## Method: connectWallet

This mimics the click of the "Connect Wallet" button on the navigation.

## Method: buttonClickByElementClass

This is an abstraction of the cy.get method.

```typescript
buttonClickByElementClass(findBy: any, { findByChild, scrollIntoView, beVisible, exist, disabled, forceClick, timeout, }?: {
    findByChild?: null        | default=null;
    scrollIntoView?: boolean  | default=true;
    beVisible?: boolean       | default=true;
    exist?: null              | default=null;
    disabled?: null           | default=null;
    forceClick?: boolean      | default=false;
    timeout?: number          | default=10000;
}): any
```

### Parameter Descriptions

Please note, these parameters definitions will be the same for the other utility methods. So, i'll only describe them once here.

**findBy** - The class you are trying to target. As a side note, you can also use HTML elements, i.e. "button". But, see "Things to note" section as this may not be appropriate.

**findByChild** - When you want to target a child element within the parent class. The child can be an element with a class, OR, an element containing certain text (see example below).

**scrollIntoView** - The test in the GUI will try to scroll into view window. Not perfect, some elements that are outside of the test window may not function correctly.

**beVisible** - This is a test to determine if the element should be visible. Abstraction of .should("be.visible").

**exist** - This is a test to determine if the element should exist. Abstraction of .should("exist") if true, and .should("not.exist") if false.

**disabled** - This is to test if an element is disabled. Abstraction of .should("be.disabled") if true, and .should("not.be.disabled") if false.

**forceClick** - This forces a click on an element that might be: disabled, covered by other elements, hidden.

**timeout** - This sets the timer for how long Cypress should wait when performing a specific test and waiting for a response. If a response fails within that period, the test has failed.

### Example

I use this method to target an element with a className attached. For example, the currency selector:

```html
<!-- button on page -->
<button class="currency-selector-item">
    <div class="some-dropdown-classes">
        <button>USDC</button>
        <button>USDT</button>
        <button>ETH</button>
    </div>
</button>
```

```typescript
buttonClickByElementClass('.currency-selector-item', {
    findByChild: 'USDC',
});
```

### Things to note

This method isn't perfect. Because a single className can be used to define multiple elements, the test will blow up if you are trying to perform a click that will impact multiple button/link elements. I didn't want to create a method for ID, as we don't use ID's at all, as its too restrictive.

## Method: buttonClickByElementText

This is an abstraction of the cy.contains method.

```typescript
buttonClickByElementText(findBy: any, { findByChild, scrollIntoView, beVisible, exist, disabled, forceClick, timeout, }?: {
    findByChild?: null        | default=null;
    scrollIntoView?: boolean  | default=true;
    beVisible?: boolean       | default=true;
    exist?: null              | default=null;
    disabled?: null           | default=null;
    forceClick?: boolean      | default=false;
    timeout?: number          | default=10000;
}): any
```

This method is very similar to buttonClickByElementText, the only difference is that its specifically for targeting elements that contains a certain piece of text. For example, "Save Changes", "Buy Now"...

```typescript
buttonClickByElementText('Save Changes');
```

## Method: elementCheckByElementClass

This method helps check to see if an element with a certain class exist.

```typescript
(alias) elementCheckByElementClass(findBy: any, { findByChild, scrollIntoView, beVisible, exist, disabled, timeout, }?: {
    findByChild?: null        | default=null;
    scrollIntoView?: boolean  | default=true;
    beVisible?: boolean       | default=true;
    exist?: null              | default=null;
    disabled?: null           | default=null;
    timeout?: number          | default=10000;
}): any
```

## Method: elementCheckByElementClass

This method helps check to see if an element with a certain text exist.

```typescript
(alias) elementCheckByElementText(findBy: any, { findByChild, scrollIntoView, beVisible, exist, disabled, timeout, }?: {
    findByChild?: null        | default=null;
    scrollIntoView?: boolean  | default=true;
    beVisible?: boolean       | default=true;
    exist?: null              | default=null;
    disabled?: null           | default=null;
    timeout?: number          | default=10000;
}): any
```

### Selecting input or textarea fields

Beyond checking content, I also use elementChecks for selecting fields like input fields.

I found that using findByChild didn't work with "input". So I suspect that this will also work with "textarea" as well.

```Typescript
// clears and input new text
elementCheckByElementClass('.last-name-input input', {
		timeout: 30000,
})
		.clear()
		.type('Doe');

// detects value in the input
elementCheckByElementClass('.last-name-input input', {
		timeout: 30000,
}).should('have.value', 'Doe');
```
