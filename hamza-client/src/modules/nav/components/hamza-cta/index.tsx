import { Text } from '@medusajs/ui';

const HamzaCTA = () => {
    return (
        <Text className="flex gap-x-2 txt-compact-small-plus items-center text-white">
            © {new Date().getFullYear()} Hamza.market. All rights reserved.
        </Text>
    );
};

export default HamzaCTA;
