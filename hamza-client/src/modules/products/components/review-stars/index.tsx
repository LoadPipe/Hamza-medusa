import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti";

export const renderStars = (rating: any) => {
    const fullStars = rating ? Math.floor(rating) : 0;
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex">
            {Array(fullStars)
                .fill(null)
                .map((_, index) => (
                    <TiStarFullOutline
                        key={`full-${index}`}
                        className="text-yellow-500 text-2xl"
                    />
                ))}
            {halfStar && (
                <TiStarHalfOutline className="text-yellow-500 text-2xl" />
            )}
            {Array(emptyStars)
                .fill(null)
                .map((_, index) => (
                    <TiStarOutline
                        key={`empty-${index}`}
                        className="text-yellow-500 text-2xl"
                    />
                ))}
        </div>
    );
};

//TODO: consolidate these two
export const renderStars20px = (rating: any) => {
    const fullStars = rating ? Math.floor(rating) : 0;
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex">
            {Array(fullStars)
                .fill(null)
                .map((_, index) => (
                    <TiStarFullOutline
                        key={`full-${index}`}
                        className="text-yellow-500 text-2xl  w-['20px'] h-['20px]"
                    />
                ))}
            {halfStar && (
                <TiStarHalfOutline className="text-yellow-500 text-2xl w-['20px'] h-['20px]" />
            )}
            {Array(emptyStars)
                .fill(null)
                .map((_, index) => (
                    <TiStarOutline
                        key={`empty-${index}`}
                        className="text-yellow-500 text-2xl w-['20px'] h-['20px]"
                    />
                ))}
        </div>
    );
};
