/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/create-domain.page";
import { FormProvider } from "~/core/contexts/form-context";
import { FormSubmitButton } from "~/core/components/design-system/ui/form-submit-button/form-submit-button";
import { CreateDomainForm } from "./create-domain.form";
import { useCreateDomain } from "./create-domain.hook";
import { PRODUCT_NAME } from "~/core/brand/product";
import {
  ApplicationStudioLayout,
  studioActionButtonSx
} from "~/applications/pages/create-application/application-studio-layout";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Create domain | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "Create a SIP domain so agents can register and call each other."
    }
  ];
}

export default function CreateDomain() {
  const { onGoBack, onSave } = useCreateDomain();

  return (
    <FormProvider>
      <ApplicationStudioLayout
        title="New domain"
        description="A domain is a group for SIP agents. The URI is the internal address they register to."
        onBack={onGoBack}
        backLabel="Back to domains"
        sideHint="Save after you set the domain URI. Add an ACL if you want to limit who can register."
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
        <CreateDomainForm onSubmit={onSave} />
      </ApplicationStudioLayout>
    </FormProvider>
  );
}
