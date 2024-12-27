export const isCryptoAddress = (input: string): boolean => {
    // Simple regex patterns to identify different crypto addresses (adjust as needed)
    const ethereumPattern = /^0x[a-fA-F0-9]{40}$/;
    const bitcoinPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    // Add more patterns as needed for other types of crypto addresses
    return ethereumPattern.test(input) || bitcoinPattern.test(input);
};
