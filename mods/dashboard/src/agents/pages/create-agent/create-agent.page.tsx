/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/create-agent.page";
import { FormProvider } from "~/core/contexts/form-context";
import { FormSubmitButton } from "~/core/components/design-system/ui/form-submit-button/form-submit-button";
import { CreateAgentForm } from "./create-agent.form";
import { useCreateAgent } from "./create-agent.hook";
import { PRODUCT_NAME } from "~/core/brand/product";
import {
  ApplicationStudioLayout,
  studioActionButtonSx
} from "~/applications/pages/create-application/application-studio-layout";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Create agent | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "Add a SIP phone or app that can register to a domain and place calls."
    }
  ];
}

export default function CreateAgent() {
  const { onGoBack, onSave } = useCreateAgent();

  return (
    <FormProvider>
      <ApplicationStudioLayout
        title="New agent"
        description="An agent is a SIP phone or app. Pick a domain, then a username and credentials so it can sign in."
        onBack={onGoBack}
        backLabel="Back to agents"
        sideHint="Save after you set the username, domain, and credentials."
        actions={
          <FormSubmitButton
            size="small"
            loadingText="Saving..."
            sx={studioActionButtonSx}
          >
            Save
          </FormSubmitButton>
        }
      >
        <CreateAgentForm onSubmit={onSave} />
      </ApplicationStudioLayout>
    </FormProvider>
  );
}
