import React, { ReactElement } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useOrderTabStore } from '@/zustand/order-tab-state';

type AccountNavLinkProps = {
    href: string;
    title: string;
    route: string;
    fontSize?: string;
    icon?: ReactElement;
    tab?: string;
    handleTabChange?: () => void;
};

const NavLink = ({
    href,
    route,
    title,
    icon,
    fontSize = '18px',
    tab,
    handleTabChange,
}: AccountNavLinkProps) => {
    const { countryCode }: { countryCode: string } = useParams();
    const { orderActiveTab } = useOrderTabStore();
    const pathname = usePathname();

    // Determine if the current route is within the Orders section
    const isInOrdersSection = pathname.startsWith(
        `/${countryCode}/account/orders`
    );

    // If it's in the Orders section, use tab-based logic, else use route-based
    const activeRoute =
        !isInOrdersSection && route.split(countryCode)[1] === href;
    const activeTab = isInOrdersSection && tab ? orderActiveTab === tab : false;
    const isActive = isInOrdersSection ? activeTab : activeRoute;

    const handleClick = () => {
        if (handleTabChange) {
            handleTabChange();
        }
    };

    return (
        <Link href={href}>
            <Flex
                borderRadius={'8px'}
                height={'56px'}
                padding="16px"
                color={isActive ? 'black' : 'white'}
                backgroundColor={isActive ? '#121212' : 'transparent'}
                alignItems={'center'}
                onClick={handleClick}
            >
                <Flex
                    width={'26px'}
                    height={'26px'}
                    color={isActive ? 'primary.green.900' : 'white'}
                >
                    {icon && icon}
                </Flex>
                <Text
                    ml={2}
                    fontSize={fontSize}
                    color={isActive ? 'primary.green.900' : 'white'}
                    fontWeight={600}
                >
                    {title}
                </Text>
            </Flex>
        </Link>
    );
};

export default NavLink;
