import { describe, expect, it } from "vitest";

import { renderAndroidReadyEmail, renderWelcomeEmail } from "../src/services/email.service";

describe("build service email templates", () => {
  it("renders a welcome template with the app name", () => {
    expect(renderWelcomeEmail("Club Demo", "http://localhost:3000").html).toContain("Club Demo");
  });

  it("renders an android ready subject", () => {
    expect(renderAndroidReadyEmail("Club Demo", "https://play.google.com").subject).toContain("Android");
  });
});
