import { cn } from "@nidorali/ui";
import type { BuildJobStatus } from "@nidorali/types";

/**
 * Badge d'état de build.
 */
export function BuildStatus({ status }: { status: BuildJobStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
        status === "done" && "bg-emerald-100 text-emerald-700",
        status === "failed" && "bg-rose-100 text-rose-700",
        status !== "done" && status !== "failed" && "bg-brand-50 text-brand-700",
      )}
    >
      {status}
    </span>
  );
}
