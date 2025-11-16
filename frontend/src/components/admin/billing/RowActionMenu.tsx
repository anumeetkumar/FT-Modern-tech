import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHoriz as MoreHorizontal,
  CreditCard,
  Receipt,
  Schedule as Clock3,
  NotificationsActive as BellRing,
  Block as ShieldOff,
} from "@mui/icons-material";

export default function RowActionMenu({
  onRenew,
  onExtend,
  onSuspend,
  onCollect,
  onReminder,
}: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal sx={{ fontSize: 16 }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onRenew}>
          <CreditCard sx={{ fontSize: 16 }} className="mr-2" /> Renew / Pay
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCollect}>
          <Receipt sx={{ fontSize: 16 }} className="mr-2" /> Collect payment
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExtend}>
          <Clock3 sx={{ fontSize: 16 }} className="mr-2" /> Extend license
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSuspend}>
          <ShieldOff sx={{ fontSize: 16 }} className="mr-2" /> Suspend
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onReminder}>
          <BellRing sx={{ fontSize: 16 }} className="mr-2" /> Send reminder
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
