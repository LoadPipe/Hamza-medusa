import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';

import NativeSelect, {
    NativeSelectProps,
} from '@modules/common/components/native-select';
import { Region } from '@medusajs/medusa';
import { Text } from '@chakra-ui/react';

const CountrySelect = forwardRef<
    HTMLSelectElement,
    NativeSelectProps & {
        region?: Region;
    }
>(({ placeholder = 'Country', region, defaultValue, ...props }, ref) => {
    const innerRef = useRef<HTMLSelectElement>(null);

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
        ref,
        () => innerRef.current
    );

    const countryOptions = useMemo(() => {
        if (!region?.countries) {
            return [];
        }

        return region.countries
            .filter((country) => country.iso_2 !== 'en')
            .map((country) => ({
                value: country.iso_2,
                label: country.display_name,
            }));
    }, [region?.countries]);

    return (
        <>
            {!region ||
                (!region.countries && (
                    <Text color="#ccc" fontSize="sm" py={4}>
                        Countries loading...
                    </Text>
                ))}
            {region?.countries && region.countries.length > 0 && (
                <NativeSelect
                    ref={innerRef}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    {...props}
                >
                    {countryOptions.map(({ value, label }, index) => (
                        <option key={index} value={value}>
                            {label}
                        </option>
                    ))}
                </NativeSelect>
            )}
        </>
    );
});

CountrySelect.displayName = 'CountrySelect';

export default CountrySelect;
