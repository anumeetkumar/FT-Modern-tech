import { Autorenew } from "@mui/icons-material"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: { className?: string }) {
  return (
    <Autorenew
      className={cn("size-4 animate-spin", className)}
      sx={{ animation: 'spin 1s linear infinite' }}
      {...props}
    />
  )
}

export { Spinner }
