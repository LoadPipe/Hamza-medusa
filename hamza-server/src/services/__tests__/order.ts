import { MockManager, MockRepository } from 'medusa-test-utils';
import OrderService from '../order';

const mockOrders = [];

const mockCustomers = [
];

const eventBusService = {
    emit: jest.fn(),
    withTransaction: function () {
        return this;
    },
};

describe('OrderService', () => {
    let orderService: OrderService;
    let orderRepository: any;

    beforeAll(() => {
        orderRepository = MockRepository({
            find: jest.fn().mockResolvedValue(mockOrders),
        });
        orderService = new OrderService({
            manager: MockManager,
            orderRepository,
            eventBusService,
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('get orders for nonexistent customer', async () => {
        const orders = await orderService.getCustomerOrders('abc');
        expect(orders.length).toEqual(0);
    });
});
