import { Text } from '@medusajs/ui';

import Medusa from '../../../common/icons/medusa';
import NextJs from '../../../common/icons/nextjs';

const MedusaCTA = () => {
    return (
        <Text className="flex gap-x-2 txt-compact-small-plus items-center text-white">
            © {new Date().getFullYear()} Hamza.market. All rights reserved.
        </Text>
    );
};

export default MedusaCTA;
