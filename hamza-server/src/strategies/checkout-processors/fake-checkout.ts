import { CheckoutProcessorBase } from './checkout-processor-base';

class FakeCheckoutProcessor extends CheckoutProcessorBase {

    constructor(container) {
        super(container)
    }
}

export default FakeCheckoutProcessor;
