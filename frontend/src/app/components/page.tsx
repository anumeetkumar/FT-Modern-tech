"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/common/StatusBadge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Calendar } from "@/components/ui/calendar";
import { PhoneInput } from "@/components/common/CommonPhoneInput";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download } from "@mui/icons-material";
import Link from "next/link";

const Components = () => {
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(true);
  const [radioValue, setRadioValue] = React.useState("option1");
  const [value, setValue] = React.useState(40);
  const [radioChoice, setRadioChoice] = React.useState("option1");
  const [selectedOption, setSelectedOption] = React.useState("apple");
  const [toggleChecked, setToggleChecked] = React.useState(true);

  const ontogglechange = () => {
    setToggleChecked(!toggleChecked);
  };

  return (
    <div className="p-10">
      <h1 className="typo-h1">Components</h1>

      {/* ---------- TYPOGRAPHY COMPONENT ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2 mb-4">Typography</h2>

        <div className="space-y-3 bg-background border border-border rounded-lg p-5">
          <h1 className="typo-h1">Heading 1 — .typo-h1</h1>
          <h2 className="typo-h2">Heading 2 — .typo-h2</h2>
          <h3 className="typo-h3">Heading 3 — .typo-h3</h3>
          <h4 className="typo-h4">Heading 4 — .typo-h4</h4>
          <h5 className="typo-h5">Heading 5 — .typo-h5</h5>
          <h6 className="typo-h6">Heading 6 — .typo-h6</h6>

          <p className="typo-p">Paragraph — .typo-p</p>
          <p className="typo-p500">Paragraph Medium — .typo-p500</p>
          <p className="typo-p600">Paragraph Semibold — .typo-p600</p>

          <p className="typo-body1">Body 1 — .typo-body1</p>
          <p className="typo-subtitle">Subtitle — .typo-subtitle</p>

          {/* Muted / small text */}
          <p className="typo-p12n">Small Text — .typo-p12n</p>
          <p className="typo-p14m">Medium 14px Text — .typo-p14m</p>
          <p className="typo-p10Muted">Muted 10px — .typo-p10Muted</p>
          <p className="typo-p12Muted">Muted 12px — .typo-p12Muted</p>
        </div>
      </div>

      {/* ---------- BUTTONS ---------- */}
      <div className="mt-5">
        <h2 className="typo-h2">Button</h2>
        <div className="flex gap-5">
          <Button variant="default" size="default">
            Default Button
          </Button>

          <Button variant="destructive" size="sm">
            Delete
          </Button>

          <Button variant="outline" size="lg">
            Outline Button
          </Button>

          <Button variant="ghost" size="icon">
            Ghost
          </Button>
        </div>
      </div>

      <div className="mt-5">
          <h2 className="typo-h2">Icons</h2>
          <div className="flex gap-5">
            <Download className="size-6 text-primary" />
            <Download className="size-6 text-muted" />
            <Download className="size-6 text-foreground" />
            </div>
      </div>

        <div className="mt-5">
          <h2 className="typo-h2">Link</h2>
          <div className="flex gap-5">
            <Link href="#" className="text-primary underline">Example Link</Link>
            </div>
      </div>

      {/* ---------- ALERT DIALOG ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Alert Dialog</h2>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Open Alert</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                item.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* ---------- ALERT COMPONENT ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Alert</h2>

        {/* Default Alert */}
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>
            This is a simple informational alert.
          </AlertDescription>
        </Alert>

        {/* Destructive Alert */}
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </Alert>
      </div>

      {/* ---------- AVATAR ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Avatar</h2>

        <div className="flex gap-4 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
            <AvatarFallback>HM</AvatarFallback>
          </Avatar>

          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>

          <Avatar className="size-12">
            <AvatarImage src="https://i.pravatar.cc/150" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* ---------- STATUS BADGE ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Status Badge</h2>

        <div className="flex gap-3 flex-wrap">
          <StatusBadge status="active" showIcon />
          <StatusBadge status="completed" showIcon />
          <StatusBadge status="pending" showIcon />
          <StatusBadge status="failed" showIcon />
          <StatusBadge status="inactive" showIcon />
          <StatusBadge status="error" showIcon />
          <StatusBadge status="expiring soon" showIcon />
          <StatusBadge status="closed" showIcon />
          <StatusBadge status="answered" showIcon />
        </div>
      </div>

      {/* ---------- CARD ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Card</h2>

        <div className="grid gap-6 max-w-lg">
          {/* Simple Card */}
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
              <CardDescription>This is a basic card layout.</CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm">Card content goes here...</p>
            </CardContent>

            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          {/* Card with Action Icon */}
          <Card>
            <CardHeader>
              <CardTitle>Card With Action</CardTitle>
              <CardDescription>Includes a header action.</CardDescription>

              <CardAction>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent>
              <p className="text-sm">You can add actions inside the header.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ---------- CHECKBOX ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Checkbox</h2>

        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2">
            <Checkbox />
            <span>Default</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox defaultChecked />
            <span>Checked</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox disabled />
            <span>Disabled</span>
          </label>
        </div>
      </div>

      {/* ---------- COMMAND ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Command Palette</h2>

        <Button onClick={() => setOpen(true)}>Open Command</Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search..." />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Suggestions">
              <CommandItem>Profile</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Actions">
              <CommandItem>Logout</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      {/* ---------- DIALOG ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Dialog</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a simple dialog description.
              </DialogDescription>
            </DialogHeader>

            <p className="text-sm">
              You can place any content inside this dialog.
            </p>

            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Continue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ---------- DROPDOWN MENU ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Dropdown Menu</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open Dropdown</Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Options</DropdownMenuLabel>

            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuCheckboxItem
              checked={checked}
              onCheckedChange={setChecked}
            >
              Enable Feature
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />

            <DropdownMenuRadioGroup
              value={radioValue}
              onValueChange={setRadioValue}
            >
              <DropdownMenuRadioItem value="option1">
                Option 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2">
                Option 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Action 1</DropdownMenuItem>
                <DropdownMenuItem>Sub Action 2</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ---------- INPUT ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Input Element</h2>

        <div className="max-w-sm flex flex-col gap-4">
          <Input placeholder="Enter your name" />

          <Input type="email" placeholder="Email address" />

          <Input type="password" placeholder="Password" />
          <Input type="number" placeholder="Enter number" />

          <Input disabled placeholder="Disabled input" />

          <Input aria-invalid="true" placeholder="Error state" />

          <Textarea placeholder="Enter text here" />

          {/* ---------- SELECT ---------- */}
          <div className="mt-8">
            <h2 className="typo-h4">Select</h2>

            <Select value={selectedOption} onValueChange={setSelectedOption}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Choose one..." />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>

                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>

                  <SelectSeparator />

                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="mango">Mango</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Toggle checked={toggleChecked} onChange={ontogglechange} />

          <Calendar
            mode="range"
            numberOfMonths={2}
            className="rounded-xl bg-white dark:bg-slate-800 p-2
                           [&_.rdp-months]:flex [&_.rdp-months]:gap-4
                           [&_.rdp-month]:bg-white dark:[&_.rdp-month]:bg-slate-800
                           [&_.rdp-month]:rounded-lg [&_.rdp-month]:p-2"
          />

          <div>
            <PhoneInput />
          </div>
        </div>
      </div>

      {/* ---------- POPOVER ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Popover</h2>

        <Popover>
          <PopoverTrigger asChild>
            <Button>Open Popover</Button>
          </PopoverTrigger>

          <PopoverContent>
            <p className="text-sm">
              This is a popover content area. You can place any UI here.
            </p>
          </PopoverContent>
        </Popover>
      </div>

      {/* ---------- PROGRESS ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Progress</h2>

        <div className="max-w-sm flex flex-col gap-4">
          <Progress value={value} />

          <Button size="sm" onClick={() => setValue(Math.min(100, value + 10))}>
            Increase 10%
          </Button>
        </div>
      </div>

      {/* ---------- RADIO GROUP ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Radio Group</h2>

        <RadioGroup
          value={radioChoice}
          onValueChange={setRadioChoice}
          className="flex flex-col gap-4"
        >
          <label className="flex items-center gap-2">
            <RadioGroupItem value="option1" />
            <span>Option 1</span>
          </label>

          <label className="flex items-center gap-2">
            <RadioGroupItem value="option2" />
            <span>Option 2</span>
          </label>

          <label className="flex items-center gap-2">
            <RadioGroupItem value="option3" />
            <span>Option 3</span>
          </label>
        </RadioGroup>
      </div>

      {/* ---------- SCROLL AREA ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Scroll Area</h2>

        <ScrollArea className="w-60 h-40 border rounded-md p-2">
          <div className="space-y-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i} className="text-sm">
                Item {i + 1}
              </p>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* ---------- SEPARATOR ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Separator</h2>

        <div className="max-w-sm space-y-4">
          <p>Above Separator</p>
          <Separator />
          <p>Below Separator</p>

          <div className="flex items-center gap-4 mt-6">
            <span>Left</span>
            <Separator orientation="vertical" />
            <span>Right</span>
          </div>
        </div>
      </div>

      {/* ---------- SHEET COMPONENT ---------- */}
      <div className="mt-10">
        <h2 className="typo-h2 mb-4">Sheet</h2>

        <div className="flex gap-10">
          {/* Sheet from Right */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="default">Open Right Sheet</Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:max-w-md overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle className="typo-h2 flex items-center gap-2">
                  Right Sheet
                </SheetTitle>
                <SheetDescription>
                  Opens from the right side of the screen.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          {/* Sheet from Left */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Left Sheet</Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full sm:max-w-md overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle className="typo-h2 flex items-center gap-2">
                  Left Sheet
                </SheetTitle>
                <SheetDescription>
                  Opens from the left side of the screen.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          {/* Sheet from Bottom */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Open Bottom Sheet</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="w-full overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="typo-h2 flex items-center gap-2">
                  Bottom Sheet
                </SheetTitle>
                <SheetDescription>
                  Slides up from the bottom — great for mobile.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* ---------- TABS COMPONENT ---------- */}
      <div className="mt-10">
        <h2 className="typo-h2 mb-4">Tabs</h2>

        <Tabs
          defaultValue="conversation"
          className="flex flex-col w-full max-w-3xl border border-border rounded-xl overflow-hidden"
        >
          <div className="px-5 pt-3 bg-background border-b border-border">
            <TabsList className="bg-background border border-border rounded-xl">
              <TabsTrigger
                value="conversation"
                className="data-[state=active]:bg-primary data-[state=active]:text-background rounded-lg px-4 py-2"
              >
                Conversation
              </TabsTrigger>
              <TabsTrigger
                value="internal"
                className="data-[state=active]:bg-primary data-[state=active]:text-background rounded-lg px-4 py-2"
              >
                Internal Notes
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Conversation Tab */}
          <TabsContent value="conversation" className="p-5 bg-background">
            <div className="space-y-4">
              <div className="typo-subtitle text-muted">
                Agent • Nov 27, 2025
              </div>
              <div className="rounded-xl border border-border px-4 py-3 bg-background">
                <p className="text-[15px] leading-relaxed text-foreground">
                  Hello 👋 This is an example of a conversation tab message.
                </p>
              </div>
              <Textarea
                placeholder="Write a reply..."
                className="min-h-[100px] resize-y border-border focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="border-border text-foreground"
                >
                  Clear
                </Button>
                <Button className="bg-primary text-background hover:bg-primary/90">
                  Send
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Internal Notes Tab */}
          <TabsContent value="internal" className="p-5 bg-background">
            <div className="space-y-4">
              <div className="typo-subtitle text-muted">
                No internal notes yet.
              </div>
              <Textarea
                placeholder="Add a private internal note..."
                className="min-h-[100px] resize-y border-border focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="border-border text-foreground"
                >
                  Clear
                </Button>
                <Button className="bg-primary text-background hover:bg-primary/90">
                  Add Note
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* ---------- TOOLTIP COMPONENT ---------- */}
        <div className="mt-10">
          <h2 className="typo-h2 mb-4">Tooltip</h2>

          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="border-border text-foreground"
                >
                  Hover me
                </Button>
              </TooltipTrigger>
              <TooltipContent>Prefills a suggested reply draft.</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="bg-primary text-background hover:bg-primary/90">
                  Save
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save your current changes.</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Components;
