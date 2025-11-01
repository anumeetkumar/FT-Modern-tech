import React from "react";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { motion } from "framer-motion";

const KpiStats = () => {
  // Data - KPIs
  const KPIS = [
    { title: "All Admins", value: 276, icon: AdminPanelSettingsOutlinedIcon },
    { title: "Total Vehicles", value: 3577, icon: DirectionsCarOutlinedIcon },
    { title: "Active Vehicle", value: 2986, icon: TimelineOutlinedIcon },
    { title: "Total Users", value: 3847, icon: PersonAddAltOutlinedIcon },
    { title: "License Issued", value: 57067, icon: ArrowOutwardOutlinedIcon },
    { title: "License Used", value: 48234, icon: CheckCircleOutlineIcon },
  ];

  const KpiCardBase = ({
    title,
    value,
    Icon,
  }: {
    title: string;
    value: number;
    Icon: any;
  }) => {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="group rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {title}
          </span>
          <Icon className="h-5 w-5 text-neutral-400 group-hover:text-neutral-900 dark:text-neutral-500 dark:group-hover:text-neutral-100" />
        </div>
        <div className="mt-3 text-2xl font-semibold tracking-tight dark:text-neutral-100">
          {Intl.NumberFormat().format(value)}
        </div>
      </motion.div>
    );
  };
  const KpiCard = React.memo(KpiCardBase);

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {KPIS.map((k) => (
        <KpiCard key={k.title} title={k.title} value={k.value} Icon={k.icon} />
      ))}
    </section>
  );
};

export default KpiStats;
