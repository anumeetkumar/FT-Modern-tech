import React from 'react';
import {
    Dashboard,
    Inventory,
    People,
    Settings,
    CalendarToday,
    Home,
    Settings as Cog,
    DesktopWindows,
    LocalShipping,
    Map,
    SimCard,
    Satellite,
    Person,
    CreditCard,
    Support,
    Article,
    Webhook,
    Security,
    AdminPanelSettings,
    Dns,
    HelpOutline,
    Shield,
    Lock,
    Headset,
    MoreHoriz,
    type SvgIconComponent,
} from "@mui/icons-material";

// Icon mapping object - using Material Design Icons
// Reference: https://mui.com/material-ui/material-icons/
const iconMap: Record<string, SvgIconComponent> = {
    // Navigation & Layout
    'layout-dashboard': Dashboard,
    'home': Home,

    // Business & Apps  
    'package': Inventory,

    // Users & People
    'users': People,
    'admin-panel': AdminPanelSettings,

    // System & Config
    'settings': Settings,
    'cog': Cog,

    // Content & Files
    'calendar': CalendarToday,
    'monitor-cog': DesktopWindows,
    'server': Dns,

    'truck': LocalShipping,
    'map': Map,
    'CardSim': SimCard,
    'SatelliteDish': Satellite,

    // User & Profile
    'user': Person,

    // Financial & Business
    'credit-card': CreditCard,

    // Support & Help
    'support': Support,
    'headset': Headset,
    'help': HelpOutline,

    // Documentation & Logs
    'logs': Article,
    'article': Article,

    // Webhooks & API
    'webhooks': Webhook,
    'webhook': Webhook,

    // Security
    'shield': Shield,
    'lock': Lock,
    'security': Security,

    // Other
    'more': MoreHoriz,


};

// Icon resolver function
export const getIcon = (iconName: string, className: string = "h-4 w-4"): React.ReactElement | null => {
    const IconComponent = iconMap[iconName];
    if (!IconComponent) {
        console.warn(`Icon "${iconName}" not found in iconMap`);
        return null;
    }
    return React.createElement(IconComponent, { className });
};

// Export available icon names for TypeScript
export type IconName = keyof typeof iconMap;

// Export the icon map for reference
export { iconMap };