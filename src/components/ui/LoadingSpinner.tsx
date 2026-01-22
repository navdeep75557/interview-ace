import * as React from "react"
import { cn } from "@/lib/utils"

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="animate-spin">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    </div>
  )
}
