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

export type NativeSelectProps = {
    placeholder?: string;
    errors?: Record<string, unknown>;
    touched?: Record<string, unknown>;
} & SelectHTMLAttributes<HTMLSelectElement>;

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
    (
        {
            placeholder = 'Select...',
            defaultValue,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const innerRef = useRef<HTMLSelectElement>(null);
        const [isPlaceholder, setIsPlaceholder] = useState(false);

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

        return (
            <div>
                <div
                    onFocus={() => innerRef.current?.focus()}
                    onBlur={() => innerRef.current?.blur()}
                    style={{
                        backgroundColor: '#020202',
                        borderColor: 'rgba(194, 194, 194, 0.7)',
                    }}
                    className={clx(
                        'relative flex items-center text-base-regular border border-ui-border-base bg-ui-bg-subtle rounded-md ',
                        className,
                        {
                            'text-ui-fg-muted': isPlaceholder,
                        }
                    )}
                >
                    <select
                        ref={innerRef}
                        defaultValue={defaultValue}
                        {...props}
                        style={{
                            color: 'rgba(194, 194, 194, 0.7)',
                            marginLeft: 'auto',
                        }}
                        className="appearance-none flex-1 bg-transparent border-none px-4 py-2.5 transition-colors duration-150 outline-none "
                    >
                        <option
                            style={{ marginLeft: 'auto' }}
                            disabled
                            value=""
                        >
                            {placeholder}
                        </option>
                        {children}
                    </select>
                    <span className="absolute right-4 inset-y-0 flex items-center pointer-events-none ">
                        <ChevronUpDown />
                    </span>
                </div>
            </div>
        );
    }
);

NativeSelect.displayName = 'NativeSelect';

export default NativeSelect;
