import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-cyan-500/20 text-cyan-100 border-cyan-500/50",
        secondary: "border-transparent bg-purple-500/20 text-purple-100 border-purple-500/50",
        destructive: "border-transparent bg-red-500/20 text-red-100 border-red-500/50",
        outline: "text-gray-300 border-gray-600",
        success: "border-transparent bg-green-500/20 text-green-100 border-green-500/50",
        warning: "border-transparent bg-amber-500/20 text-amber-100 border-amber-500/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }