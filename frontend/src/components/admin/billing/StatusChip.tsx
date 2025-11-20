export default function StatusChip({
  label,
  active,
  onClick,
  tone = "zinc",
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  tone?: "zinc" | "amber" | "rose";
}) {
  const toneClasses: Record<string, string> = {
    zinc: "bg-zinc-100 text-zinc-700 border-zinc-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200",
    rose: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full typo-p border ${
        toneClasses[tone]
      } ${active ? "ring-2 ring-black" : ""}`}
    >
      {label}
    </button>
  );
}