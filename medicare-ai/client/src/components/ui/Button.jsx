import React from 'react';

export function Button({
    children,
    className = "",
    variant = "default",
    size = "default",
    ...props
}) {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
        ghost: "hover:bg-gray-100 text-gray-700",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        link: "text-blue-600 underline-offset-4 hover:underline"
    };

    const sizes = {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10 p-2"
    };

    const variantClass = variants[variant] || variants.default;
    const sizeClass = sizes[size] || sizes.default;

    return (
        <button
            className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
