import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';

import NativeSelect, {
    NativeSelectProps,
} from '@modules/common/components/native-select';
import { Region } from '@medusajs/medusa';

const CountrySelect = forwardRef<
    HTMLSelectElement,
    NativeSelectProps & {
        region?: Region;
        onSearch?: (value: string) => void;
    }
>(
    (
        { placeholder = 'Country', region, defaultValue, onSearch, ...props },
        ref
    ) => {
        const innerRef = useRef<HTMLSelectElement>(null);

        useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
            ref,
            () => innerRef.current
        );

        const countryOptions = useMemo(() => {
            if (!region) {
                return [];
            }

            return region.countries.map((country) => ({
                value: country.iso_2,
                label: country.display_name,
            }));
        }, [region]);

        return (
            <NativeSelect
                ref={innerRef}
                placeholder={placeholder}
                defaultValue={defaultValue}
                countryOption={countryOptions}
                onSearch={onSearch}
            ></NativeSelect>
        );
    }
);

CountrySelect.displayName = 'CountrySelect';

export default CountrySelect;
