import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes safely using clsx and tailwind-merge.
 * @param  {...any} inputs - Class names, objects, or arrays to be merged.
 * @returns {string} - The merged class string.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}
