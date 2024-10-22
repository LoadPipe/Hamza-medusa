import { Spinner, Trash } from '@medusajs/icons';
import { clx } from '@medusajs/ui';
import { useState } from 'react';

import { deleteLineItem } from '@modules/cart/actions';

const RemoveProductsButton = ({
    id,
    onDelete,
    children,
    className,
}: {
    id: string;
    onDelete: (id: string) => void; // Callback for parent to handle delete
    children?: React.ReactNode;
    className?: string;
}) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
            await deleteLineItem(id);
            onDelete(id); // Call the parent's onDelete to remove from UI
        } catch (err) {
            setIsDeleting(false);
        }
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
                disabled={isDeleting}
            >
                <span>{children}</span>
            </button>
        </div>
    );
};

export default RemoveProductsButton;
