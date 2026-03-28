import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, size = 20, readonly = false, onChange }) => {
  const [hoverRating, setHoverRating] = React.useState(0);
  const [currentRating, setCurrentRating] = React.useState(rating || 0);

  const handleStarClick = (starValue) => {
    if (!readonly) {
      setCurrentRating(starValue);
      if (onChange) {
        onChange(starValue);
      }
    }
  };

  const handleStarHover = (starValue) => {
    if (!readonly) {
      setHoverRating(starValue);
    }
  };

  const handleStarLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hoverRating || currentRating);
        return (
          <Star
            key={star}
            size={size}
            className={`
              cursor-pointer transition-colors
              ${filled 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300 hover:text-yellow-200'
              }
              ${readonly ? 'cursor-default' : ''}
            `}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={handleStarLeave}
          />
        );
      })}
      {!readonly && (
        <span className="ml-2 text-sm text-gray-600">
          {currentRating > 0 && `${currentRating}/5`}
        </span>
      )}
    </div>
  );
};

export default StarRating;
