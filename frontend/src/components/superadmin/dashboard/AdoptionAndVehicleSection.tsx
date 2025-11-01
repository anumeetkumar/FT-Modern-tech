import React, { useEffect, useMemo, useState } from "react";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import { motion, AnimatePresence } from "framer-motion";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const AdoptionAndVehicleSection = () => {
  const [tf, setTf] = useState<"12m" | "6m" | "3m">("12m");
  const [showVehicles, setShowVehicles] = useState(true);
  const [showUsers, setShowUsers] = useState(true);
  const [showLicenses, setShowLicenses] = useState(true);
  type ChartComp = React.ComponentType<any> | null;
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
  const [ApexChart, setApexChart] = useState<ChartComp>(null);
  const [chartError, setChartError] = useState<null | string>(null);
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Derive timeframe slice
  const tfLen = tf === "12m" ? 12 : tf === "6m" ? 6 : 3;
  const cats = useMemo(() => months.slice(-tfLen), [tfLen]);
  const vehicles = useMemo(() => vehiclesRaw.slice(-tfLen), [tfLen]);
  const users = useMemo(() => usersRaw.slice(-tfLen), [tfLen]);
  const licenses = useMemo(() => licensesRaw.slice(-tfLen), [tfLen]);

  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    tone: "neutral",
  });

  const vehicleStatus = [
    { label: "Running", count: 2986, pct: 26.6 },
    { label: "Stop", count: 111, pct: 0.99 },
    { label: "Not Working (48 hours)", count: 7194, pct: 64.08 },
    { label: "No Data", count: 935, pct: 8.33 },
  ];

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

  // Toasts
  type ToastState = {
    open: boolean;
    message: string;
    tone: "neutral" | "success" | "warning" | "error";
  };
  const showToast = (message: string, tone: ToastState["tone"] = "neutral") => {
    setToast({ open: true, message, tone });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 1500);
  };

  // Clipboard utility with fallbacks
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Build series based on toggles
  const adoptionSeries = useMemo(() => {
    const series: any[] = [];
    if (showVehicles) series.push({ name: "Vehicles", data: vehicles });
    if (showUsers) series.push({ name: "Users", data: users });
    if (showLicenses) series.push({ name: "Licenses", data: licenses });
    return series;
  }, [showVehicles, showUsers, showLicenses, vehicles, users, licenses]);

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

  return (
    <>
      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[7fr_3fr]">
        {/* Adoption Graph */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <TimelineOutlinedIcon className="h-5 w-5 text-neutral-800 dark:text-neutral-300" />
              <h3 className="text-sm font-semibold dark:text-neutral-100">
                Adoption & Growth
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <ToggleChip active={tf === "12m"} onClick={() => setTf("12m")}>
                12M
              </ToggleChip>
              <ToggleChip active={tf === "6m"} onClick={() => setTf("6m")}>
                6M
              </ToggleChip>
              <ToggleChip active={tf === "3m"} onClick={() => setTf("3m")}>
                3M
              </ToggleChip>
              <span className="mx-1 h-4 w-px bg-neutral-300 dark:bg-neutral-600" />
              <ToggleChip
                active={showVehicles}
                onClick={() => setShowVehicles((v) => !v)}
              >
                Vehicles
              </ToggleChip>
              <ToggleChip
                active={showUsers}
                onClick={() => setShowUsers((v) => !v)}
              >
                Users
              </ToggleChip>
              <ToggleChip
                active={showLicenses}
                onClick={() => setShowLicenses((v) => !v)}
              >
                Licenses
              </ToggleChip>
              <span className="mx-1 h-4 w-px bg-neutral-300 dark:bg-neutral-600" />
              <button
                onClick={async () => {
                  const payload = JSON.stringify(
                    { cats, adoptionSeries },
                    null,
                    2
                  );
                  const result = await safeCopyText(payload);
                  if (result === "copied")
                    showToast("Copied to clipboard", "success");
                  else if (result === "exec")
                    showToast("Copied (fallback)", "success");
                  else if (result === "download")
                    showToast("Downloaded series.json", "neutral");
                  else if (result === "modal")
                    showToast("Manual copy: opened modal", "warning");
                }}
                className="rounded-xl border border-neutral-300 p-1 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700"
                title="Copy/Export series JSON"
              >
                <ContentCopyOutlinedIcon fontSize="small" />
              </button>
              <button
                className="rounded-xl border border-neutral-300 p-1 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700"
                title="Chart settings"
              >
                <TuneOutlinedIcon fontSize="small" />
              </button>
            </div>
          </div>

          <div className="w-full">
            {/* Safe Chart Mounting & Skeleton */}
            {isClient && typeof ApexChart === "function" ? (
              adoptionSeries.length > 0 ? (
                // @ts-ignore - ApexChart is a valid React component
                <ApexChart
                  options={adoptionOptions}
                  series={adoptionSeries}
                  type="area"
                  height={300}
                />
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50 text-xs text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                  Enable at least one series.
                </div>
              )
            ) : (
              <div className="relative h-[300px] w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
                <div className="absolute inset-0 animate-pulse bg-[linear-gradient(90deg,#f5f5f5_25%,#ededed_50%,#f5f5f5_75%)] bg-[length:200%_100%] dark:bg-[linear-gradient(90deg,#262626_25%,#171717_50%,#262626_75%)]" />
                <div className="relative z-10 m-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
                  {chartError ? (
                    <div>
                      <p className="font-medium text-neutral-700">
                        Chart unavailable
                      </p>
                      <p className="mt-1">{chartError}</p>
                      <p className="mt-1">
                        Install: <code>npm i apexcharts react-apexcharts</code>
                      </p>
                    </div>
                  ) : (
                    <span>Loading chart…</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Status Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-3 flex items-center gap-2">
            <DirectionsCarOutlinedIcon className="h-5 w-5 text-neutral-800 dark:text-neutral-300" />
            <h3 className="text-sm font-semibold dark:text-neutral-100">
              Vehicle Status
            </h3>
          </div>
          <div className="space-y-4">
            {vehicleStatus.map((s) => (
              <motion.div key={s.label} whileHover={{ scale: 1.01 }}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {s.label}
                  </span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {Intl.NumberFormat().format(s.count)}{" "}
                    <span className="text-neutral-500 dark:text-neutral-400">
                      ({s.pct}%)
                    </span>
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-700">
                  <div
                    className="h-2 rounded-full bg-neutral-900 dark:bg-neutral-100"
                    style={{ width: `${Math.min(100, Math.max(0, s.pct))}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
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
      {/* Toast */}
      <Toast {...toast} />
    </>
  );
};

export default AdoptionAndVehicleSection;
