"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  applyBrandingColors,
  saveBrandingColors,
  clearBrandingColors,
  type BrandingColors,
} from "@/lib/themeUtils";
import { useDynamicTheme } from "@/lib/hooks/useDynamicTheme";

import PaletteIcon from "@mui/icons-material/Palette";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import CheckIcon from "@mui/icons-material/Check";

/* ---------------- THEMES ---------------- */
export const defaultColors: BrandingColors = {
  light: {
    "--primary": "#000000",
    "--secondary": "#ffffff",
    "--accent": "#333333",
    "--background": "#ffffff",
    "--foreground": "#000000",
    "--muted": "#666666",
    "--border": "#e5e5e5",
    "--success": "#22c55e",
    "--warning": "#f59e0b",
    "--error": "#ef4444",
  },
  dark: {
    "--primary": "#ffffff",
    "--secondary": "#000000",
    "--accent": "#d4d4d4",
    "--background": "#0a0a0a",
    "--foreground": "#ffffff",
    "--muted": "#a3a3a3",
    "--border": "#262626",
    "--success": "#22c55e",
    "--warning": "#f59e0b",
    "--error": "#ef4444",
  },
};

export const corporateBlue: BrandingColors = {
  light: {
    "--primary": "#0B63E5",
    "--secondary": "#F2F6FC",
    "--accent": "#14406B",
    "--background": "#FFFFFF",
    "--foreground": "#0F172A",
    "--muted": "#6C7A91",
    "--border": "#D8E0EC",
    "--success": "#1BAA61",
    "--warning": "#E6A700",
    "--error": "#D92D20",
  },
  dark: {
    "--primary": "#4D9CFF",
    "--secondary": "#1B2536",
    "--accent": "#A7C8FF",
    "--background": "#0D1117",
    "--foreground": "#F8FAFC",
    "--muted": "#A7B4C7",
    "--border": "#2C3A52",
    "--success": "#21C97B",
    "--warning": "#F2C94C",
    "--error": "#F06464",
  },
};

export const modernPurple: BrandingColors = {
  light: {
    "--primary": "#7A38F6",
    "--secondary": "#F7F3FF",
    "--accent": "#4B1B84",
    "--background": "#FFFFFF",
    "--foreground": "#18181B",
    "--muted": "#6F6C8D",
    "--border": "#E3D7FF",
    "--success": "#11AF7A",
    "--warning": "#F5B935",
    "--error": "#E64545",
  },
  dark: {
    "--primary": "#C49AFF",
    "--secondary": "#191028",
    "--accent": "#E4D4FF",
    "--background": "#110B1F",
    "--foreground": "#FAF7FF",
    "--muted": "#BC9CFF",
    "--border": "#443061",
    "--success": "#27D19A",
    "--warning": "#F8D247",
    "--error": "#FF6F6F",
  },
};

export const luxuryGold: BrandingColors = {
  light: {
    "--primary": "#C8A349",
    "--secondary": "#141414",
    "--accent": "#5A4B25",
    "--background": "#FFFFFF",
    "--foreground": "#121212",
    "--muted": "#7A7A7A",
    "--border": "#D9C799",
    "--success": "#178A4D",
    "--warning": "#DFAE15",
    "--error": "#C33131",
  },
  dark: {
    "--primary": "#E5C979",
    "--secondary": "#000000",
    "--accent": "#8F7238",
    "--background": "#0A0A0A",
    "--foreground": "#F5F5F5",
    "--muted": "#B7B7B7",
    "--border": "#3B351F",
    "--success": "#1CC469",
    "--warning": "#E3C33A",
    "--error": "#F26A5A",
  },
};

export const futuristicNeon: BrandingColors = {
  light: {
    "--primary": "#00D6F7",
    "--secondary": "#11151B",
    "--accent": "#00F7A7",
    "--background": "#FFFFFF",
    "--foreground": "#0D0D0D",
    "--muted": "#70808A",
    "--border": "#DCE7EA",
    "--success": "#00C694",
    "--warning": "#FFB340",
    "--error": "#FF5252",
  },
  dark: {
    "--primary": "#00C0E8",
    "--secondary": "#0A0E13",
    "--accent": "#00F2A8",
    "--background": "#04080B",
    "--foreground": "#E9FFFF",
    "--muted": "#6C9A9E",
    "--border": "#1D3A48",
    "--success": "#01E0A3",
    "--warning": "#FFC764",
    "--error": "#FF7070",
  },
};

const themePresets = {
  Default: defaultColors,
  Corporate: corporateBlue,
  Modern: modernPurple,
  Luxury: luxuryGold,
  Futuristic: futuristicNeon,
};

/* ---------------- MAIN COMPONENT ---------------- */
function SuperAdminBranding() {
  const { updateTheme } = useDynamicTheme();

  const [colors, setColors] = useState<BrandingColors>(defaultColors);
  const [activeTheme, setActiveTheme] = useState<"light" | "dark">("light");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("fleetstack_branding_colors");
    if (saved) {
      const parsed = JSON.parse(saved);
      setColors(parsed);
      applyBrandingColors(parsed);
    }
  }, []);

  /* Live update on typing */
  const handleColorChange = (theme: "light" | "dark", key: keyof BrandingColors["light"], val: string) => {
    const regex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
    if (!regex.test(val)) return;

    const updated = { ...colors, [theme]: { ...colors[theme], [key]: val } };
    setColors(updated);
    setHasChanges(true);

    applyBrandingColors(updated);
    updateTheme({ mode: theme, colors: updated[theme] });
  };

  const handlePresetApply = (preset: BrandingColors) => {
    setColors(preset);
    setHasChanges(true);

    applyBrandingColors(preset);
    updateTheme({ mode: activeTheme, colors: preset[activeTheme] });
  };

  const handleReset = () => {
    setColors(defaultColors);
    setHasChanges(false);
    applyBrandingColors(defaultColors);
    clearBrandingColors();
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    saveBrandingColors(colors);
    setHasChanges(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    setIsSaving(false);
  };

  const currentTheme = colors[activeTheme];

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted">Theme Customization</div>
            <CardTitle className="typo-h1">Branding & Colors</CardTitle>
            <p className="typo-p-muted mt-1">Customize color schemes and instantly preview UI.</p>
          </div>

          {/* Swatch Presets */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(themePresets).map(([title, preset]) => {
              const previewColor = preset.light["--primary"] || preset.light["--primary"];
              const isActive = JSON.stringify(colors) === JSON.stringify(preset);

              return (
                <div
                  key={title}
                  className="flex flex-col items-center cursor-pointer gap-1"
                  onClick={() => handlePresetApply(preset)}
                >
                  <div
                    className="h-10 w-10 rounded-xl"
                    style={{
                      backgroundColor: previewColor,
                      border: isActive ? "3px solid var(--foreground)" : "2px solid transparent",
                    }}
                  />
                  <span className="text-[11px] opacity-70">{title}</span>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {hasChanges && (
              <Badge variant="outline" className="rounded-full border-amber-500 text-amber-600">
                Unsaved Changes
              </Badge>
            )}
            <Button variant="outline" disabled={!hasChanges || isSaving} onClick={handleReset}>
              <RestartAltIcon fontSize="small" className="mr-2" /> Reset
            </Button>
            <Button disabled={!hasChanges || isSaving} onClick={handleSave}>
              {isSaving ? "Saving..." : <><SaveIcon fontSize="small" className="mr-2" /> Save</>}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">

        {showSuccessMessage && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription>Theme saved successfully.</AlertDescription>
          </Alert>
        )}

        {/* Preview Mode Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl border dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <PaletteIcon />
            <div>
              <div className="font-semibold">Active Preview</div>
              <div className="text-sm opacity-60">Switch between light & dark</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant={activeTheme === "light" ? "default" : "outline"} onClick={() => { setActiveTheme("light"); updateTheme({ mode: "light", colors: colors.light }); }}>
              <LightModeIcon fontSize="small" className="mr-2" /> Light
            </Button>
            <Button size="sm" variant={activeTheme === "dark" ? "default" : "outline"} onClick={() => { setActiveTheme("dark"); updateTheme({ mode: "dark", colors: colors.dark }); }}>
              <DarkModeIcon fontSize="small" className="mr-2" /> Dark
            </Button>
          </div>
        </div>

        {/* Live Preview */}
        <LivePreview currentTheme={currentTheme} activeTheme={activeTheme} />

        {/* Color Form */}
        <ColorConfiguration colors={colors} handleColorChange={handleColorChange} />
      </CardContent>
    </Card>
  );
}

/* ---------------- SUB COMPONENTS ---------------- */

function ColorInput({ label, value, onChange }: any) {
  const [val, setVal] = useState(value);
  const [valid, setValid] = useState(true);

  useEffect(() => setVal(value), [value]);

  const update = (v: string) => {
    setVal(v);
    const ok = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(v);
    setValid(ok);
    if (ok) onChange(v);
  };

  return (
    <div className="space-y-1">
      <Label className="font-medium">{label}</Label>
      <div className="relative">
        <Input value={val} onChange={(e) => update(e.target.value)} className={`pr-12 font-mono ${!valid && "border-red-500"}`} />
        <input type="color" value={valid ? val : value} onChange={(e) => update(e.target.value)}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 cursor-pointer border rounded" />
      </div>
      {!valid && <span className="text-[10px] text-red-500">Enter valid hex (#000000)</span>}
    </div>
  );
}

function ColorConfiguration({ colors, handleColorChange }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {(["light", "dark"] as const).map((mode) => (
        <div key={mode} className="rounded-2xl border p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="font-semibold uppercase text-sm mb-4 flex items-center gap-2">
            {mode === "light" ? <LightModeIcon /> : <DarkModeIcon />} {mode.toUpperCase()} MODE
          </h3>
          <div className="space-y-4">
            {Object.keys(colors[mode]).map((key) => (
              <ColorInput
                key={key}
                label={key.replace("--", "")}
                value={colors[mode][key]}
                onChange={(v: string) => handleColorChange(mode, key, v)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LivePreview({ currentTheme, activeTheme }: any) {
  return (
    <div className="rounded-2xl border p-5 dark:border-neutral-700 dark:bg-neutral-800">
      <div
        className="rounded-xl p-6 space-y-4"
        style={{
          backgroundColor: currentTheme["--background"],
          borderColor: currentTheme["--border"],
          borderWidth: 1,
        }}
      >
        <h4 style={{ color: currentTheme["--foreground"] }} className="font-bold text-xl">Sample Dashboard</h4>

        <p style={{ color: currentTheme["--foreground"] }}>This is how your UI will look.</p>
        <p style={{ color: currentTheme["--muted"] }}>Muted text example</p>

        <div className="flex gap-2 pt-2">
          <button className="px-4 py-2 rounded-lg font-semibold"
            style={{ backgroundColor: currentTheme["--primary"], color: activeTheme === "light" ? "#fff" : "#000" }}>
            Primary Button
          </button>
          <button className="px-4 py-2 rounded-lg font-semibold"
            style={{ borderColor: currentTheme["--border"], borderWidth: 1, color: currentTheme["--foreground"] }}>
            Secondary Button
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminBranding;
