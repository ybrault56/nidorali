import { redirect } from "next/navigation";

/**
 * Redirige vers la première étape du wizard.
 */
export default function ConfigureIndexPage() {
  redirect("/configure/branding");
}
