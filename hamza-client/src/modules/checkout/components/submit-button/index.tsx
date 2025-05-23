'use client';

import { Button } from '@chakra-ui/react';
import React from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitButton({
    children,
    variant = 'primary',
    className,
    'data-testid': dataTestId,
}: {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'transparent' | 'danger' | undefined;
    className?: string;
    'data-testid'?: string;
}) {
    const { pending } = useFormStatus();

    return (
        <Button
            size="large"
            className={className}
            type="submit"
            isLoading={pending}
            variant={variant}
            data-testid={dataTestId}
        >
            {children}
        </Button>
    );
}
