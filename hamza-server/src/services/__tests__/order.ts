import { MockManager, MockRepository } from 'medusa-test-utils';
import OrderService from '../order';

const mockOrders = [{
    id: 'order01',
    status: 'AWAITING',
    customer_id: 'cust01',
}];

function createMockRepository(mockData) {
    const repo = MockRepository();
    repo.findOne = jest.fn().mockImplementation((id) => {
        return mockOrders.find((item) => item.id === id);
    });

    repo.find = jest.fn().mockImplementation((query) => {
        console.log("QUERY:", query)
        if (!query?.where) return mockData;
        return mockData.filter((item) =>
            Object.keys(query).every((key) => item[key] === query.where[key])
        );
    });

    return repo;
}

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
        orderRepository = createMockRepository(mockOrders);

        //orderRepository.setData(mockOrders);
        orderService = new OrderService({
            manager: MockManager,
            orderRepository,
            eventBusService,
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /*
    it('get orders for nonexistent customer', async () => {
        const orders = await orderService.getCustomerOrders('abc');
        console.log(orders);
        expect(orders.length).toEqual(0);
    });
*/
    it('get orders for existing customer', async () => {
        const orders = await orderService.getCustomerOrders('cust01');
        expect(orders.length).toEqual(1);
    });
});
