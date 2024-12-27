import { isEqual, omit, defaults, mapValues } from 'lodash';

export default function compareSelectedAddress(address1: any, address2: any) {
    const normalizeAddress = (address: any) =>
        mapValues(
            defaults(address, {
                address_1: '',
                address_2: '',
                city: '',
                company: '',
                postal_code: '',
                province: '',
                country_code: '',
            }),
            (value) => (value === null ? '' : value)
        );

    const cleanedAddress1 = omit(normalizeAddress(address1), [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
        'metadata',
        'customer_id',
    ]);

    const cleanedAddress2 = omit(normalizeAddress(address2), [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
        'metadata',
        'customer_id',
    ]);

    return isEqual(cleanedAddress1, cleanedAddress2);
}
