import PaymentStatus from '@/app/components/payment-status/PaymentStatus';
import { Container } from '@chakra-ui/react';

export default function ProcessingPage() {
    // This would typically come from your API or state management
    const mockData = {
        paymentId: '01JC4F67Z990AB32',
        status: 'received' as const,
        createdAt: 'Sunday, March 16 2025 • 10:02 am',
        totalAmount: 1619.01,
        totalOrders: 2,
        paymentAddress: '0x1234567890abcdef1234567890abcdef12345678',
        orders: [
            {
                id: 'ORD-001',
                storeName: 'Apple Official Store',
                amount: 1499.99,
                details: {
                    name: '2024 Macbook Pro 14" M3 Chip 8GB Unified Memory 512GB SSD Storage',
                    specs: 'Aviation: 8GB Ram | 512GB SSD | Space Gray',
                },
            },
            {
                id: 'ORD-002',
                storeName: 'Datablitz',
                amount: 109.99,
                details: {
                    name: '2024 Macbook Pro 14" M3 Chip 8GB Unified Memory 512GB SSD Storage',
                    specs: 'Aviation: 8GB Ram | 512GB SSD | Space Gray',
                },
            },
        ],
    };

    return (
        <Container maxW="container.lg" py={8}>
            <PaymentStatus {...mockData} />
        </Container>
    );
}
