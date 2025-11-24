'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Icons
import { 
  Add as AddIcon, 
  Check, 
  ExpandMore as ChevronsUpDown, 
  Add as Plus 
} from '@mui/icons-material';

// Types
import { AddDeviceFormData, DeviceType, SIM } from '@/lib/types/devices';

// Form validation schema
const addDeviceSchema = z.object({
  imei: z.string().min(15, 'IMEI must be at least 15 characters').max(17, 'IMEI must not exceed 17 characters'),
  deviceTypeId: z.string().min(1, 'Please select a device type'),
  simId: z.string().optional(),
});

interface AddDeviceDialogProps {
  onSubmit: (data: AddDeviceFormData) => Promise<void>;
  deviceTypes: DeviceType[];
  sims: SIM[];
  onAddNewSim?: () => void;
}

export function AddDeviceDialog({ onSubmit, deviceTypes, sims, onAddNewSim }: AddDeviceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simSearchOpen, setSimSearchOpen] = useState(false);

  const form = useForm<AddDeviceFormData>({
    resolver: zodResolver(addDeviceSchema),
    defaultValues: {
      imei: '',
      deviceTypeId: '',
      simId: '',
    },
  });

  const handleSubmit = async (data: AddDeviceFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast.success('Device added successfully!');
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to add device. Please try again.');
      console.error('Add device error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSims = sims.filter(sim => sim.status === 'active');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button >
          <AddIcon className="w-4 h-4 mr-2" />
          Add Device
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="imei"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IMEI *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter IMEI number" 
                      {...field}
                      maxLength={17}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deviceTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select device type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {deviceTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="simId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>SIM (Optional)</FormLabel>
                  <Popover open={simSearchOpen} onOpenChange={setSimSearchOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={simSearchOpen}
                          className="w-full justify-between"
                        >
                          {field.value
                            ? availableSims.find((sim) => sim.id === field.value)?.number || 'Unknown SIM'
                            : "Select SIM (optional)"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search SIM..." />
                        <CommandList>
                          <CommandEmpty>No SIM found.</CommandEmpty>
                          <CommandGroup>
                            {onAddNewSim && (
                              <CommandItem
                                onSelect={() => {
                                  setSimSearchOpen(false);
                                  onAddNewSim();
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add New SIM
                              </CommandItem>
                            )}
                            <CommandItem
                              onSelect={() => {
                                field.onChange('');
                                setSimSearchOpen(false);
                              }}
                            >
                              <span className="text-gray-500">None (No SIM)</span>
                            </CommandItem>
                            {availableSims.map((sim) => (
                              <CommandItem
                                key={sim.id}
                                onSelect={() => {
                                  field.onChange(sim.id);
                                  setSimSearchOpen(false);
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    field.value === sim.id ? 'opacity-100' : 'opacity-0'
                                  }`}
                                />
                                <div>
                                  <div className="font-medium">{sim.number}</div>
                                  <div className="typo-p-muted">{sim.provider}</div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Device'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}