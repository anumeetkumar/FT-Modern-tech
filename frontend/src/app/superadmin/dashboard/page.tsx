"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Material Design Icons
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import SubscriptionBanner from "@/components/superadmin/dashboard/SubscriptionBanner";
import KpiStats from "@/components/superadmin/dashboard/KpiStats";
import AdoptionAndVehicleSection from "@/components/superadmin/dashboard/AdoptionAndVehicleSection";

export default function FleetStackDashboard() {
  // State
  const [showLicenseBanner, setShowLicenseBanner] = useState(true);
  type ChartComp = React.ComponentType<any> | null;
  const [ApexChart, setApexChart] = useState<ChartComp>(null);
  const [chartError, setChartError] = useState<null | string>(null);
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Chart controls
  const [tf, setTf] = useState<"12m" | "6m" | "3m">("12m");
  const [showVehicles, setShowVehicles] = useState(true);
  const [showUsers, setShowUsers] = useState(true);
  const [showLicenses, setShowLicenses] = useState(true);

  // Detect dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Last sync ticker
  const [secondsSinceSync, setSecondsSinceSync] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSecondsSinceSync((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Toasts
  type ToastState = {
    open: boolean;
    message: string;
    tone: "neutral" | "success" | "warning" | "error";
  };
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    tone: "neutral",
  });
  const showToast = (message: string, tone: ToastState["tone"] = "neutral") => {
    setToast({ open: true, message, tone });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 1500);
  };

  // Load ApexCharts dynamically
  useEffect(() => {
    setIsClient(true);
    let mounted = true;
    (async () => {
      try {
        const mod = await import("react-apexcharts");
        if (!mounted) return;
        const chart = mod?.default ?? mod;
        if (typeof chart === "function") {
          setApexChart(() => chart);
        } else {
          setChartError("Invalid react-apexcharts export");
        }
      } catch (err: any) {
        console.error("react-apexcharts load failed", err);
        if (mounted)
          setChartError(err?.message || "Chart module failed to load");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Data - KPIs
  const KPIS = [
    { title: "All Admins", value: 276, icon: AdminPanelSettingsOutlinedIcon },
    { title: "Total Vehicles", value: 3577, icon: DirectionsCarOutlinedIcon },
    { title: "Active Vehicle", value: 2986, icon: TimelineOutlinedIcon },
    { title: "Total Users", value: 3847, icon: PersonAddAltOutlinedIcon },
    { title: "License Issued", value: 57067, icon: ArrowOutwardOutlinedIcon },
    { title: "License Used", value: 48234, icon: CheckCircleOutlineIcon },
  ];

  // Monthly categories and raw series
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const vehiclesRaw = [
    120, 160, 240, 355, 540, 840, 1120, 1500, 2050, 2600, 3100, 3577,
  ];
  const usersRaw = [
    80, 130, 210, 340, 500, 760, 980, 1400, 2000, 2600, 3200, 3847,
  ];
  const licensesRaw = [
    1000, 2500, 5000, 8500, 12000, 18000, 25000, 32000, 38000, 45000, 52000,
    57067,
  ];

  // Derive timeframe slice
  const tfLen = tf === "12m" ? 12 : tf === "6m" ? 6 : 3;
  const cats = useMemo(() => months.slice(-tfLen), [tfLen]);
  const vehicles = useMemo(() => vehiclesRaw.slice(-tfLen), [tfLen]);
  const users = useMemo(() => usersRaw.slice(-tfLen), [tfLen]);
  const licenses = useMemo(() => licensesRaw.slice(-tfLen), [tfLen]);

  // Apex options
  const adoptionOptions: any = useMemo(
    () => ({
      chart: {
        type: "area",
        toolbar: { show: false },
        animations: { enabled: true, easing: "easeinout", speed: 600 },
        background: "transparent",
      },
      colors: ["#000000", "#525252", "#737373"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.8,
          opacityFrom: 0.3,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      grid: {
        borderColor: "#e5e5e5",
        strokeDashArray: 3,
      },
      xaxis: {
        categories: cats,
        axisTicks: { show: false },
        axisBorder: { show: false },
        labels: {
          style: {
            colors: "#6b7280",
            cssClass: "dark:fill-neutral-400",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (v: number) =>
            `${Intl.NumberFormat("en-US", { notation: "compact" }).format(v)}`,
          style: {
            colors: "#6b7280",
            cssClass: "dark:fill-neutral-400",
          },
        },
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        labels: {
          colors: "#6b7280",
          useSeriesColors: false,
        },
        markers: {
          width: 12,
          height: 12,
          radius: 2,
        },
      },
      tooltip: {
        theme: isDarkMode ? "dark" : "light",
        style: {
          fontSize: "12px",
          fontFamily: "inherit",
        },
        y: {
          formatter: (v: number) => `${Intl.NumberFormat().format(v)}`,
        },
      },
    }),
    [cats, isDarkMode]
  );

  // Build series based on toggles
  const adoptionSeries = useMemo(() => {
    const series: any[] = [];
    if (showVehicles) series.push({ name: "Vehicles", data: vehicles });
    if (showUsers) series.push({ name: "Users", data: users });
    if (showLicenses) series.push({ name: "Licenses", data: licenses });
    return series;
  }, [showVehicles, showUsers, showLicenses, vehicles, users, licenses]);

  // Data - Recent entries
  const recentUsers = [
    {
      name: "Aarav Sharma",
      email: "aarav.s@example.com",
      time: "Today, 15:22",
    },
    { name: "Maya Rao", email: "maya.rao@example.com", time: "Today, 14:10" },
    {
      name: "Ibrahim Khan",
      email: "ibrahim.k@example.com",
      time: "Yesterday, 20:06",
    },
    {
      name: "Sophia Das",
      email: "sophia.d@example.com",
      time: "Yesterday, 18:41",
    },
    {
      name: "Ethan Patel",
      email: "ethan.p@example.com",
      time: "Oct 14, 09:33",
    },
    { name: "Liam Chen", email: "liam.c@example.com", time: "Oct 13, 16:20" },
    {
      name: "Olivia Kumar",
      email: "olivia.k@example.com",
      time: "Oct 12, 11:45",
    },
  ];

  const recentVehicles = [
    {
      name: "MH-12-AB-1234",
      model: "Tata Ace",
      status: "Active",
      added: "Today, 10:15",
    },
    {
      name: "DL-08-CD-5678",
      model: "Mahindra Bolero",
      status: "Active",
      added: "Today, 09:30",
    },
    {
      name: "KA-01-EF-9012",
      model: "Ashok Leyland",
      status: "Inactive",
      added: "Yesterday, 16:45",
    },
    {
      name: "TN-22-GH-3456",
      model: "Eicher Pro",
      status: "Active",
      added: "Yesterday, 14:20",
    },
    {
      name: "GJ-18-IJ-7890",
      model: "Tata 407",
      status: "Active",
      added: "Oct 16, 11:00",
    },
    {
      name: "RJ-14-KL-2345",
      model: "Force Traveller",
      status: "Not Working",
      added: "Oct 15, 13:30",
    },
    {
      name: "UP-32-MN-6789",
      model: "Mahindra Pickup",
      status: "Active",
      added: "Oct 14, 15:10",
    },
  ];

  const recentTransactions = [
    {
      id: "TXN-2024-10-1234",
      admin: "Aarav Sharma",
      type: "License Purchase",
      amount: 15000,
      status: "Completed",
      date: "Today, 11:30",
    },
    {
      id: "TXN-2024-10-1233",
      admin: "Maya Rao",
      type: "Subscription Renewal",
      amount: 25000,
      status: "Completed",
      date: "Today, 09:15",
    },
    {
      id: "TXN-2024-10-1232",
      admin: "Ibrahim Khan",
      type: "License Purchase",
      amount: 8500,
      status: "Pending",
      date: "Yesterday, 18:20",
    },
    {
      id: "TXN-2024-10-1231",
      admin: "Sophia Das",
      type: "Add-on Features",
      amount: 5000,
      status: "Completed",
      date: "Yesterday, 15:45",
    },
    {
      id: "TXN-2024-10-1230",
      admin: "Ethan Patel",
      type: "License Purchase",
      amount: 12000,
      status: "Completed",
      date: "Oct 16, 14:30",
    },
    {
      id: "TXN-2024-10-1229",
      admin: "Liam Chen",
      type: "Subscription Renewal",
      amount: 30000,
      status: "Failed",
      date: "Oct 16, 10:00",
    },
    {
      id: "TXN-2024-10-1228",
      admin: "Olivia Kumar",
      type: "License Purchase",
      amount: 18000,
      status: "Completed",
      date: "Oct 15, 16:50",
    },
  ];

  const notifications = [
    {
      title: "Device offline > 24h",
      detail: "7 vehicles require attention",
      time: "10m ago",
    },
    {
      title: "New admin invited",
      detail: "sophia.d@example.com",
      time: "1h ago",
    },
    {
      title: "License quota nearing",
      detail: "85% of pool consumed",
      time: "3h ago",
    },
    {
      title: "Report generated",
      detail: "October Utilization PDF",
      time: "Yesterday",
    },
    {
      title: "System maintenance",
      detail: "Scheduled for Oct 20",
      time: "2 days ago",
    },
    {
      title: "New feature released",
      detail: "Advanced analytics available",
      time: "3 days ago",
    },
  ];

  const activities = [
    { who: "Aarav S.", what: "created geofence 'Warehouse-7'", when: "08:12" },
    { who: "Maya R.", what: "added 12 vehicles via CSV", when: "09:45" },
    {
      who: "Ibrahim K.",
      what: "updated driver profile #D-1183",
      when: "10:03",
    },
    { who: "Sophia D.", what: "scheduled daily idle report", when: "11:29" },
    { who: "Ethan P.", what: "exported monthly analytics", when: "12:15" },
    { who: "Liam C.", what: "configured new alert rule", when: "13:40" },
  ];

  const vehicleStatus = [
    { label: "Running", count: 2986, pct: 26.6 },
    { label: "Stop", count: 111, pct: 0.99 },
    { label: "Not Working (48 hours)", count: 7194, pct: 64.08 },
    { label: "No Data", count: 935, pct: 8.33 },
  ];

  // Clipboard utility with fallbacks
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  async function safeCopyText(
    text: string
  ): Promise<"copied" | "exec" | "download" | "modal"> {
    try {
      if (navigator?.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return "copied";
      }
    } catch (e) {
      // Continue to fallbacks
    }

    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) return "exec";
    } catch {}

    try {
      const blob = new Blob([text], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "series.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return "download";
    } catch {}

    setModalContent(text);
    setCopyModalOpen(true);
    return "modal";
  }

  // UI Components
  const ToggleChip = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`rounded-xl border px-3 py-1 text-xs transition ${
        active
          ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
          : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
      }`}
    >
      {children}
    </button>
  );

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

  const Toast = ({ open, message, tone }: ToastState) => (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className={`fixed bottom-6 right-6 z-50 rounded-xl border px-3 py-2 text-xs shadow-sm ${
            tone === "success"
              ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
              : tone === "warning"
              ? "border-neutral-300 bg-neutral-50 text-neutral-800 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200"
              : tone === "error"
              ? "border-neutral-300 bg-neutral-50 text-neutral-800 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200"
              : "border-neutral-300 bg-white text-neutral-800 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200"
          }`}
          role="status"
          aria-live="polite"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render
  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="mx-auto max-w-7xl px-6 pb-14 pt-8">
        {/* License Banner */}
        <SubscriptionBanner />

        {/* Quick Actions */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800">
              + Create Admin
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="hidden sm:inline">Last sync:</span>
            <span>{secondsSinceSync}s ago</span>
            <button
              className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Refresh"
            >
              <RefreshOutlinedIcon fontSize="small" />
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <KpiStats/>

        {/* Chart + Vehicle Status */}
      <AdoptionAndVehicleSection/>

        {/* Lists Row (Scrollable) - First Row */}
        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Recent Vehicles */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DirectionsCarOutlinedIcon className="h-5 w-5 text-neutral-800 dark:text-neutral-300" />
                <h3 className="text-sm font-semibold dark:text-neutral-100">
                  Recent Vehicles
                </h3>
              </div>
            </div>
            <div className="h-80 overflow-y-auto pr-1">
              <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {recentVehicles.map((v, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-700">
                        <DirectionsCarOutlinedIcon className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {v.name}
                        </p>
                        <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                          {v.model}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          v.status === "Active"
                            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                            : v.status === "Inactive"
                            ? "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
                            : "bg-neutral-100 text-neutral-600 dark:bg-neutral-600 dark:text-neutral-200"
                        }`}
                      >
                        {v.status}
                      </span>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {v.added}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ReceiptLongOutlinedIcon className="h-5 w-5 text-neutral-800 dark:text-neutral-300" />
                <h3 className="text-sm font-semibold dark:text-neutral-100">
                  Recent Transactions
                </h3>
              </div>
              <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700">
                <Link href="transactions">View All</Link>
                <ArrowForwardIcon className="h-3 w-3" />
              </button>
            </div>
            <div className="h-80 overflow-y-auto pr-1">
              <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {recentTransactions.map((t, idx) => (
                  <li key={idx} className="py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {t.id}
                        </p>
                        <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                          {t.admin} • {t.type}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          ₹{Intl.NumberFormat().format(t.amount)}
                        </p>
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            t.status === "Completed"
                              ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                              : t.status === "Pending"
                              ? "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
                              : "bg-neutral-100 text-neutral-600 dark:bg-neutral-600 dark:text-neutral-200"
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                      {t.date}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Users */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-3 flex items-center gap-2">
              <PersonAddAltOutlinedIcon className="h-5 w-5 text-neutral-800 dark:text-neutral-300" />
              <h3 className="text-sm font-semibold dark:text-neutral-100">
                Recent Users
              </h3>
            </div>
            <div className="h-80 overflow-y-auto pr-1">
              <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {recentUsers.map((u, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-white text-xs font-medium text-neutral-800 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200">
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {u.name}
                        </p>
                        <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                          {u.email}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
                      {u.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Lists Row (Scrollable) - Second Row */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Recent Notifications */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-3 flex items-center gap-2">
              <NotificationsNoneOutlinedIcon className="h-5 w-5 text-neutral-800 dark:text-neutral-300" />
              <h3 className="text-sm font-semibold dark:text-neutral-100">
                Recent Notifications
              </h3>
            </div>
            <div className="h-80 overflow-y-auto pr-1">
              <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {notifications.map((n, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {n.title}
                      </p>
                      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {n.detail}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
                      {n.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent User Activity */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-3 flex items-center gap-2">
              <TimelineOutlinedIcon className="h-5 w-5 text-neutral-800 dark:text-neutral-300" />
              <h3 className="text-sm font-semibold dark:text-neutral-100">
                Recent User Activity
              </h3>
            </div>
            <div className="h-80 overflow-y-auto pr-1">
              <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {activities.map((a, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {a.who}
                      </p>
                      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {a.what}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
                      {a.when}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Toast */}
      <Toast {...toast} />

      {/* Copy Modal (last resort when clipboard is blocked) */}
      <AnimatePresence>
        {copyModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40 dark:bg-black/60"
              onClick={() => setCopyModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="relative z-10 w-[min(90vw,720px)] rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-700 dark:bg-neutral-800"
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Manual Copy
                </h4>
                <button
                  className="rounded-lg p-1 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                  onClick={() => setCopyModalOpen(false)}
                  aria-label="Close"
                >
                  <CloseRoundedIcon fontSize="small" />
                </button>
              </div>
              <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
                Your environment blocks programmatic clipboard writes. Select
                all and press{" "}
                <strong className="dark:text-neutral-200">Ctrl/⌘ + C</strong>.
              </p>
              <textarea
                readOnly
                value={modalContent}
                className="h-56 w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-[11px] text-neutral-800 focus:outline-none dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
                onFocus={(e) => e.currentTarget.select()}
              />
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  className="rounded-xl border border-neutral-300 px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  onClick={() => setCopyModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
