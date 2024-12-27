import { MockManager, MockRepository } from 'medusa-test-utils';
import StoreService from '../store';

const mockStores = [
    {
        name: 'Medusa Store',
        owner_id: null,
        massmarket_store_id: '',
        massmarket_keycard: '',
        icon: null,
        id: 'store_01J20RCECPSPFCVM9H059M8XJS',
        created_at: '2024-07-05T06:12:55.818Z',
        updated_at: '2024-07-15T09:53:05.658Z',
        default_currency_code: 'eth',
        swap_link_template: null,
        payment_link_template: null,
        invite_link_template: null,
        default_location_id: null,
        metadata: null,
        default_sales_channel_id: 'sc_01J20RCEDRF508YB2DXQ6PB3Q5',
    },
    // Add more stores as needed
];

const eventBusService = {
    emit: jest.fn(),
    withTransaction: function () {
        return this;
    },
};

describe('StoreService', () => {
    let storeService: StoreService;
    let storeRepository: any;

    beforeAll(() => {
        storeRepository = MockRepository({
            find: jest.fn().mockResolvedValue(mockStores),
        });
        storeService = new StoreService({
            manager: MockManager,
            storeRepository,
            eventBusService,
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return the stores', async () => {
        const stores = await storeService.getStores();
        expect(stores).toEqual(mockStores);
    });
});
