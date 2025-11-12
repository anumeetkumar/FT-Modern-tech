'use client';

import React from 'react';
import { SmartCheckboxAutoTable, DisplayMap, MultiSelectOption } from '@/components/common/smartcheckboxautotable';
import { DeviceRow } from '@/lib/types/devices';
import { Badge } from '@/components/ui/badge';

interface DevicesTableProps {
  devices: DeviceRow[];
  onRefresh?: () => Promise<void>;
  onDeviceAction?: (action: string, devices: DeviceRow[]) => void;
}

export function DevicesTable({ devices, onRefresh, onDeviceAction }: DevicesTableProps) {
  
  const displayOptions: DisplayMap<DeviceRow> = {
    0: {
      title: () => <div className="font-semibold">IMEI</div>,
      content: (row: DeviceRow) => (
        <div className="font-mono text-sm">
          {row.IMEI}
        </div>
      ),
    },
    1: {
      title: () => <div className="font-semibold">Device Type</div>,
      content: (row: DeviceRow) => (
        <div className="font-medium">
          {row.DeviceType}
        </div>
      ),
    },
    2: {
      title: () => <div className="font-semibold">SIM</div>,
      content: (row: DeviceRow) => (
        <div>
          {row.SIM ? (
            <div className="font-mono text-sm">
              {row.SIM}
            </div>
          ) : (
            <span className="text-gray-400 italic">No SIM</span>
          )}
        </div>
      ),
    },
    3: {
      title: () => <div className="font-semibold">SIM Provider</div>,
      content: (row: DeviceRow) => (
        <div>
          {row.SIMProvider ? (
            <span className="text-sm">{row.SIMProvider}</span>
          ) : (
            <span className="text-gray-400 italic">-</span>
          )}
        </div>
      ),
    },
    4: {
      title: () => <div className="font-semibold">Status</div>,
      content: (row: DeviceRow) => {
        const statusColors = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-800", 
          maintenance: "bg-yellow-100 text-yellow-800"
        };
        
        return (
          <Badge 
            className={`${statusColors[row.Status]} border-0`}
            variant="secondary"
          >
            {row.Status.charAt(0).toUpperCase() + row.Status.slice(1)}
          </Badge>
        );
      },
    },
    5: {
      title: () => <div className="font-semibold">Created</div>,
      content: (row: DeviceRow) => (
        <div className="text-sm text-gray-600">
          {new Date(row.CreatedAt).toLocaleDateString()}
        </div>
      ),
    },
  };

  const multiSelectOptions: MultiSelectOption<DeviceRow>[] = [
    {
      name: "Activate Devices",
      callback: async (selectedRows) => {
        if (onDeviceAction) {
          onDeviceAction('activate', selectedRows);
        }
      },
      variant: "default",
      iconName: "power_settings_new",
      tooltip: "Activate selected devices"
    },
    {
      name: "Deactivate Devices", 
      callback: async (selectedRows) => {
        if (onDeviceAction) {
          onDeviceAction('deactivate', selectedRows);
        }
      },
      variant: "secondary",
      iconName: "power_off",
      tooltip: "Deactivate selected devices"
    },
    {
      name: "Set Maintenance",
      callback: async (selectedRows) => {
        if (onDeviceAction) {
          onDeviceAction('maintenance', selectedRows);
        }
      },
      variant: "outline",
      iconName: "build",
      tooltip: "Set devices to maintenance mode"
    },
    {
      name: "Delete Devices",
      callback: async (selectedRows) => {
        if (confirm(`Are you sure you want to delete ${selectedRows.length} device(s)?`)) {
          if (onDeviceAction) {
            onDeviceAction('delete', selectedRows);
          }
        }
      },
      variant: "destructive",
      iconName: "delete",
      tooltip: "Delete selected devices"
    },
    {
      name: "Export Selected",
      callback: async (selectedRows) => {
        // Create CSV content
        const headers = ['IMEI', 'DeviceType', 'SIM', 'SIMProvider', 'Status', 'CreatedAt'];
        const csvContent = [
          headers.join(','),
          ...selectedRows.map(row => [
            row.IMEI,
            row.DeviceType,
            row.SIM || '',
            row.SIMProvider || '',
            row.Status,
            row.CreatedAt
          ].join(','))
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `devices_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      variant: "outline",
      iconName: "download",
      tooltip: "Export selected devices to CSV"
    }
  ];

  const filterConfig = {
    imei: {
      kind: "text" as const,
      label: "IMEI",
      field: "IMEI" as keyof DeviceRow,
    },
    deviceType: {
      kind: "select" as const,
      label: "Device Type", 
      field: "DeviceType" as keyof DeviceRow,
      options: Array.from(new Set(devices.map(d => d.DeviceType))).map(type => ({
        value: type,
        label: type
      }))
    },
    simProvider: {
      kind: "select" as const,
      label: "SIM Provider",
      field: "SIMProvider" as keyof DeviceRow,
      options: Array.from(new Set(devices.map(d => d.SIMProvider).filter(Boolean))).map(provider => ({
        value: provider!,
        label: provider!
      }))
    },
    status: {
      kind: "select" as const,
      label: "Status",
      field: "Status" as keyof DeviceRow,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "maintenance", label: "Maintenance" }
      ]
    },
    createdAt: {
      kind: "dateRange" as const,
      label: "Created Date",
      field: "CreatedAt" as keyof DeviceRow,
    }
  };

  return (
    <SmartCheckboxAutoTable<DeviceRow>
      title="Devices"
      data={devices}
      getRowId={(row) => row.IMEI}
      displayOptions={displayOptions}
      filterConfig={filterConfig}
      multiSelectOptions={multiSelectOptions}
      onRefresh={onRefresh}
      exportBrand={{
        name: "FleetStack",
        footerNote: "Device Management System"
      }}
    />
  );
}