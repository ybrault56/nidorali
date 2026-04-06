import { beforeEach, describe, expect, it } from "vitest";

import { useConfiguratorStore } from "../store/configurator";

describe("configurator store", () => {
  beforeEach(() => {
    useConfiguratorStore.getState().reset();
  });

  it("builds a checkout payload aligned with the shared contract", () => {
    const store = useConfiguratorStore.getState();
    store.setOrganization({
      billing_email: "contact@epinal.fr",
      organization_type: "collectivite",
    });
    store.setBranding({
      app_name: "Mairie d'Epinal",
    });
    store.setModules({
      module_news: true,
      module_planning: true,
    });
    store.setUsers(2000);

    expect(useConfiguratorStore.getState().getPayload()).toMatchObject({
      app_name: "Mairie d'Epinal",
      billing_email: "contact@epinal.fr",
      bundle_id: "com.nidorali.mairiedepinal",
      slug: "mairie-d-epinal",
      tenant_config: {
        max_users: 2000,
        module_news: true,
        module_planning: true,
      },
    });
  });
});
