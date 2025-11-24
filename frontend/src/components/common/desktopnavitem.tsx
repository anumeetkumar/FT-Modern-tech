"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { KeyboardArrowDown } from "@mui/icons-material";
import { getIcon, type IconName } from "@/lib/iconResolver";
import { useIntl } from "react-intl";

function DesktopNavItem({
  label,
  icon,
  route,
  items,
}: {
  label: string;
  icon?: IconName;
  route?: string;
  items?: { name: string; icon: IconName; route?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  const isLeaf = !items || items.length === 0;

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {isLeaf && route ? (
        <Link
          href={route}
          className="flex items-center gap-2 rounded-lg px-2 py-1 hover:text-black dark:hover:text-primary"
        >
          {icon && getIcon(icon)}
          {useIntl().formatMessage({ id: label })}
        </Link>
      ) : (
        <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:text-black dark:hover:text-primary">
          {icon && getIcon(icon)}
          {label}
          {items && items.length > 0 && (
            <KeyboardArrowDown
              className={`h-3 w-3 transition-transform ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          )}
        </button>
      )}
      {open && items && (
        <div className="absolute left-0 top-full z-[150] mt-1 min-w-[220px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
          {items.map((item) =>
            item.route ? (
              <Link
                key={item.name}
                href={item.route}
                className="flex items-center gap-2 px-4 py-2 typo-p-muted hover:bg-slate-50  dark:hover:bg-slate-800"
              >
                {item.icon && getIcon(item.icon)}
                {item.name}
              </Link>
            ) : (
              <span
                key={item.name}
                className="flex items-center gap-2 px-4 py-2 typo-p-muted hover:bg-slate-50  dark:hover:bg-slate-800"
              >
                {item.icon && getIcon(item.icon)}
                {item.name}
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default DesktopNavItem;
