import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

const StarRating = ({ initialRating = 0, maxStars = 5, onRate, readonly = false, size = 20 }) => {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    return (
        <div className="flex items-center space-x-1">
            {[...Array(maxStars)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <button
                        key={index}
                        type="button"
                        className={cn(
                            "p-0.5 focus:outline-none transition-transform duration-200",
                            !readonly && "hover:scale-125 active:scale-95 cursor-pointer"
                        )}
                        onClick={() => {
                            if (!readonly) {
                                setRating(starValue);
                                onRate?.(starValue);
                            }
                        }}
                        onMouseEnter={() => !readonly && setHover(starValue)}
                        onMouseLeave={() => !readonly && setHover(0)}
                        disabled={readonly}
                    >
                        <Star
                            size={size}
                            className={cn(
                                "transition-colors duration-200",
                                starValue <= (hover || rating)
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-200 fill-transparent"
                            )}
                        />
                    </button>
                );
            })}
            {rating > 0 && !readonly && (
                <span className="ml-2 text-sm font-bold text-gray-500">{rating}/{maxStars}</span>
            )}
        </div>
    );
};

export default StarRating;
