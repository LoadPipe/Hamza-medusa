// {formatStatus}
export const formatStatus = (status: string) => {
    const formattedStatus = status
        .replace(/_/g, ' ')
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    return `${formattedStatus}`; // Return the final string with prefix
};

// Custom format: "Month Date, Year, Hour:Minute AM/PM"
// {formatDate}
export const formatDate = (date: Date | string, locale = 'en-US'): string => {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return parsedDate.toLocaleString(locale, {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // AM/PM formatting
    });
};

// Combine first_name + last_name for loading name...
export const customerName = (first_name: string, last_name: string): string => {
    return `${first_name} ${last_name}`;
};

export const formatShippingAddress = (
    address_1: string,
    address_2: string,
    city: string,
    province: string,
    postal_code: string,
    country_code: string
) => {
    const parts = [
        address_1,
        address_2,
        city,
        province,
        postal_code,
        country_code,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(', ') : 'Undefined';
};

export const capitalizeWords = (str: string) => {
    return str
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters (e.g., "inTransit" → "in Transit")
        .replace(/^./, (char) => char.toUpperCase()) // Capitalize the first letter
        .trim(); // Remove any extra spaces
};
