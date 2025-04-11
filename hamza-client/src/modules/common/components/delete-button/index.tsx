import { Spinner, Trash } from '@medusajs/icons';
import { clx } from '@medusajs/ui';
import { useState } from 'react';
import { deleteLineItem } from '@modules/cart/actions';
import { useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '@/zustand/cart-store/cart-store';

const DeleteButton = ({
    id,
    children,
    className,
}: {
    id: string;
    children?: React.ReactNode;
    className?: string;
}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const queryClient = useQueryClient();
    const setIsUpdatingCart = useCartStore((state) => state.setIsUpdatingCart);
    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        setIsUpdatingCart(true);
        await deleteLineItem(id).catch((err) => {
            setIsDeleting(false);
            setIsUpdatingCart(false);
        });
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        setIsDeleting(false);
        setIsUpdatingCart(false);
    };

    return (
        <div
            className={clx(
                'flex items-center justify-between text-small-regular',
                className
            )}
        >
            <button
                className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
                onClick={() => handleDelete(id)}
            >
                {isDeleting ? (
                    <Spinner className="animate-spin" />
                ) : (
                    <Trash color="red" />
                )}
                <span>{children}</span>
            </button>
        </div>
    );
};

export default DeleteButton;
