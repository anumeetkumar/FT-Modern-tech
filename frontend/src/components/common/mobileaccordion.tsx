import { KeyboardArrowDown } from '@mui/icons-material';
import React, { useState } from 'react'
import Link from 'next/link';
import { getIcon, type IconName } from '@/lib/iconResolver';

function MobileAccordion({ label, icon, route, items }: { 
  label: string; 
  icon?: IconName; 
  route?: string;
  items?: { name: string; icon: IconName; route?: string }[] 
}) {
  const [open, setOpen] = useState(false);
  const isLeaf = !items || items.length === 0;

  return (
    <li>
      {isLeaf && route ? (
        <Link
          href={route}
          className="flex w-full items-center gap-2 px-3 py-3 text-left typo-p500 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span className="flex items-center gap-2">{icon && getIcon(icon)}{label}</span>
        </Link>
      ) : (
        <button
          className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left typo-p500 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          onClick={() => !isLeaf && setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className="flex items-center gap-2">{icon && getIcon(icon)}{label}</span>
          {!isLeaf && <KeyboardArrowDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />}
        </button>
      )}
      {!isLeaf && (
        <div className={`${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"} grid overflow-hidden transition-all duration-300 ease-in-out`}>
          <div className="min-h-0">
            {items!.map((item) => (
              item.route ? (
                <Link
                  key={item.name}
                  href={item.route}
                  className="flex items-center gap-2 px-10 py-2 typo-p-muted hover:bg-slate-50  dark:hover:bg-slate-800"
                >
                  {item.icon && getIcon(item.icon)}
                  {item.name}
                </Link>
              ) : (
                <span
                  key={item.name}
                  className="flex items-center gap-2 px-10 py-2 typo-p-muted hover:bg-slate-50  dark:hover:bg-slate-800"
                >
                  {item.icon && getIcon(item.icon)}
                  {item.name}
                </span>
              )
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

export default MobileAccordion;