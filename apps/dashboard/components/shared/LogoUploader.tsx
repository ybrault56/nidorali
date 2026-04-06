"use client";

import { UploadCloud } from "lucide-react";
import { useRef } from "react";

import { cn } from "@nidorali/ui";

interface LogoUploaderProps {
  onChange: (value: string | null) => void;
  value: string | null;
}

/**
 * Upload local de logo avec prévisualisation immédiate.
 */
export function LogoUploader({ onChange, value }: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <button
        className={cn(
          "flex min-h-36 w-full flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-sm text-slate-600 hover:border-brand-400 hover:bg-brand-50",
        )}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {value ? (
          <img alt="Logo tenant" className="size-16 rounded-2xl object-cover" src={value} />
        ) : (
          <UploadCloud className="size-10 text-brand-500" />
        )}
        <span>{value ? "Remplacer le logo" : "Téléverser un logo"}</span>
      </button>
      <input
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            onChange(null);
            return;
          }

          const reader = new FileReader();
          reader.onload = () => onChange(typeof reader.result === "string" ? reader.result : null);
          reader.readAsDataURL(file);
        }}
        ref={inputRef}
        type="file"
      />
    </div>
  );
}
