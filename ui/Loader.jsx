import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = ({ className }) => (
    <div className={cn("animate-pulse bg-gray-100 rounded-lg", className)} />
);

export const Loader = ({ size = "md", className }) => {
    const sizes = {
        sm: "w-6 h-6 border-2",
        md: "w-10 h-10 border-3",
        lg: "w-16 h-16 border-4"
    };

    return (
        <div className={cn("flex items-center justify-center", className)}>
            <div className={cn(
                "border-brand-orange/20 border-t-brand-orange rounded-full animate-spin",
                sizes[size]
            )} />
        </div>
    );
};
