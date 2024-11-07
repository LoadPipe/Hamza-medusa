import { ChevronUpDown } from '@medusajs/icons';
import { clx } from '@medusajs/ui';
import {
    SelectHTMLAttributes,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';

interface CountryOption {
    label: string;
    value: string;
}

export type NativeSelectProps = {
    placeholder?: string;
    errors?: Record<string, unknown>;
    touched?: Record<string, unknown>;
    countryOption: CountryOption[];
    onSearch?: (value: string) => void;
} & SelectHTMLAttributes<HTMLSelectElement>;

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
    (
        {
            placeholder = 'Select...',
            defaultValue,
            className,
            children,
            onSearch,
            countryOption,
            ...props
        },
        ref
    ) => {
        const innerRef = useRef<HTMLSelectElement>(null);
        const [isPlaceholder, setIsPlaceholder] = useState(false);
        const [query, setQuery] = useState(''); // State for input query
        const previousQuery = useRef(''); // Track the previous query to avoid infinite loops

        useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
            ref,
            () => innerRef.current
        );

        useEffect(() => {
            if (innerRef.current && innerRef.current.value === '') {
                setIsPlaceholder(true);
            } else {
                setIsPlaceholder(false);
            }
        }, [innerRef.current?.value]);

        // Filter options based on the query
        const filteredOptions = countryOption.filter((option) =>
            option.label.toLowerCase().includes(query.toLowerCase())
        );

        // Trigger onSearch with the first match's value whenever the query changes
        useEffect(() => {
            if (
                onSearch &&
                query !== previousQuery.current && // Only call onSearch if query changed
                filteredOptions.length > 0
            ) {
                onSearch(filteredOptions[0].value);
                previousQuery.current = query; // Update previous query to current
            }
        }, [query, filteredOptions, onSearch]);

        return (
            <div>
                <div
                    style={{
                        backgroundColor: '#020202',
                        borderColor: '#555555',
                    }}
                    className={clx(
                        'relative flex items-center text-base-regular border border-ui-border-base bg-ui-bg-subtle rounded-md',
                        className,
                        {
                            'text-ui-fg-muted': isPlaceholder,
                        }
                    )}
                >
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            color: '#555555',
                            width: '150px', // Set a reasonable width for the input
                            minWidth: '150px', // Ensure the input does not shrink
                            padding: '8px',
                        }}
                        className="bg-transparent border-none outline-none"
                    />
                    <select
                        ref={innerRef}
                        defaultValue={defaultValue}
                        {...props}
                        style={{
                            color: '#555555',
                            minWidth: '200px', // Minimum width to accommodate long country names
                            padding: '8px',
                        }}
                        className="appearance-none flex-1 bg-transparent border-none transition-colors duration-150 outline-none"
                    >
                        <option disabled value="">
                            {placeholder}
                        </option>
                        {filteredOptions.map(({ value, label }, index) => (
                            <option key={index} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <span className="absolute right-4 inset-y-0 flex items-center pointer-events-none">
                        <ChevronUpDown />
                    </span>
                </div>
            </div>
        );
    }
);

NativeSelect.displayName = 'NativeSelect';

export default NativeSelect;
