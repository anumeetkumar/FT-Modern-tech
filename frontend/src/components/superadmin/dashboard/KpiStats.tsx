import React from "react";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import {
  DirectionsCar,
  EventBusy,
  Payments,
  People,
  TrendingUp,
  WarningAmber,
} from "@mui/icons-material";
import KpiCardBase from "@/components/common/KpiCardBase";

const KpiStats = ({ isSuperadmin = true }: { isSuperadmin?: boolean }) => {
  const SuperAdminKPIS = [
    { title: "All Admins", value: 276, icon: AdminPanelSettingsOutlinedIcon },
    { title: "Total Vehicles", value: 3577, icon: DirectionsCarOutlinedIcon },
    { title: "Active Vehicle", value: 2986, icon: TimelineOutlinedIcon },
    { title: "Total Users", value: 3847, icon: PersonAddAltOutlinedIcon },
    { title: "License Issued", value: 57067, icon: ArrowOutwardOutlinedIcon },
    { title: "License Used", value: 48234, icon: CheckCircleOutlineIcon },
  ];

  const AdminKPIS = [
    { title: "Vehicles", value: 3577, icon: DirectionsCar },
    { title: "Users", value: 3847, icon: People },
    { title: "Vehicle Expiry (30d)", value: 129, icon: WarningAmber },
    { title: "Vehicle Expired", value: 74, icon: EventBusy },
    { title: "Revenue • Last Month", value: 48234 , icon: Payments },
    { title: "Forecasting • This Month", value: 57067 , icon: TrendingUp },
  ];


  const KpiCard = React.memo(KpiCardBase);

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {(isSuperadmin ? SuperAdminKPIS : AdminKPIS).map((k) => (
        <KpiCard key={k.title} title={k.title} value={k.value} Icon={k.icon} />
      ))}
    </section>
  );
};

export default KpiStats;
