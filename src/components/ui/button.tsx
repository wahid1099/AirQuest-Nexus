import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30 border border-cyan-500/50 glow-border",
        destructive: "bg-red-500/20 text-red-100 hover:bg-red-500/30 border border-red-500/50",
        outline: "border border-gray-600 bg-transparent hover:bg-gray-800/50 text-gray-100",
        secondary: "bg-purple-500/20 text-purple-100 hover:bg-purple-500/30 border border-purple-500/50",
        ghost: "hover:bg-gray-800/50 text-gray-100",
        success: "bg-green-500/20 text-green-100 hover:bg-green-500/30 border border-green-500/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }