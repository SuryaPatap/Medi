import * as React from "react"
import { cn } from "../../lib/utils"

const badgeVariants = {
    default: "bg-primary text-white hover:bg-primary/80",
    secondary: "bg-secondary text-gray-900 hover:bg-secondary/80",
    outline: "text-gray-950 border border-neutral-dark",
    success: "bg-success text-white hover:bg-success/80",
    warning: "bg-warning text-gray-900 hover:bg-warning/80",
    danger: "bg-danger text-white hover:bg-danger/80",
}

const statusMap = {
    active: "success",
    completed: "success",
    paid: "success",
    pending: "warning",
    scheduled: "primary",
    cancelled: "danger",
    overdue: "danger",
    inactive: "secondary"
}

function StatusBadge({ className, dropdownItem, status, variant, ...props }) {
    // Auto-detect variant from status string if provided
    const detectedVariant = status ? (statusMap[status.toLowerCase()] || "default") : (variant || "default")

    return (
        <div className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2",
            badgeVariants[detectedVariant],
            className
        )} {...props} />
    )
}

export { StatusBadge }
