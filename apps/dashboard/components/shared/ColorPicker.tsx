"use client";

import { Input } from "../ui/Input";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Sélecteur de couleur hexadécimale.
 */
export function ColorPicker({ label, onChange, value }: ColorPickerProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2">
        <input
          aria-label={label}
          className="size-10 rounded-xl border border-slate-200 bg-transparent"
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          type="color"
          value={value}
        />
        <Input className="border-0 px-0 py-0 focus:ring-0" onChange={(event) => onChange(event.target.value.toUpperCase())} value={value} />
      </div>
    </label>
  );
}
