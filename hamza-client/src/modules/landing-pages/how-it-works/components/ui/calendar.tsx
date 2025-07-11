'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@modules/landing-pages/how-it-works/lib/utils';
import { buttonVariants } from '@modules/landing-pages/how-it-works/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return <></>;
}
Calendar.displayName = 'Calendar';

export { Calendar };
