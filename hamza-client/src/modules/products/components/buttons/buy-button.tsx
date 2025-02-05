import { Button } from '@medusajs/ui';

type BuyButtonProps = {
    styles: string;
    handleBuyNow: () => void;
    loader: boolean;
    outOfStock: boolean;
    title?: string;
    isWhitelisted: boolean;
};

const BuyButton: React.FC<BuyButtonProps> = ({
    styles,
    handleBuyNow,
    loader,
    outOfStock,
    title,
    isWhitelisted,
}) => {
    return (
        <>
            <Button
                className={styles}
                variant="primary"
                onClick={handleBuyNow}
                isLoading={loader}
                disabled={outOfStock && !isWhitelisted}
            >
                Buy Now
            </Button>
            {outOfStock && isWhitelisted && (
                <span className="text-xs">
                    You can buy it as you are whitelisted customer
                </span>
            )}
        </>
    );
};

export default BuyButton;
