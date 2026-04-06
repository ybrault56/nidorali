import { redirect } from "next/navigation";

/**
 * Redirige vers le configurateur principal.
 */
export default function HomePage() {
  redirect("/configure");
}
