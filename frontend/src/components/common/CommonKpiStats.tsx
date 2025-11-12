"use client";

import React from "react";
import { motion } from "framer-motion";
import KpiCardBase from "./KpiCardBase";

interface KpiItem {
  title: string;
  value: number;
  icon?: React.ElementType;
}

interface KpiStatsProps {
  data: KpiItem[];
}


const KpiCard = React.memo(KpiCardBase);

const CommonKpiStats: React.FC<KpiStatsProps> = ({ data }) => {
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {data.map((k) => (
        <KpiCard key={k.title} title={k.title} value={k.value} Icon={k.icon} />
      ))}
    </section>
  );
};

export default CommonKpiStats;
