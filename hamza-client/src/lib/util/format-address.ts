export const formatAddress = (
    address: string,
    startLength: number = 6,
    endLength: number = 4
): string => {
    if (!address) return '';
    const start = address.substring(0, startLength);
    const end = address.substring(address.length - endLength, address.length);
    return `${start}...${end}`;
};
