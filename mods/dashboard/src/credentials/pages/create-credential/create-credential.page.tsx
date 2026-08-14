/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/create-credential.page";
import { FormProvider } from "~/core/contexts/form-context";
import { FormSubmitButton } from "~/core/components/design-system/ui/form-submit-button/form-submit-button";
import { CreateCredentialForm } from "./create-credential.form";
import { useCreateCredential } from "./create-credential.hook";
import { PRODUCT_NAME } from "~/core/brand/product";
import {
  ApplicationStudioLayout,
  studioActionButtonSx
} from "~/applications/pages/create-application/application-studio-layout";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Create credentials | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "Add a username and password that SIP agents and trunks can use to sign in."
    }
  ];
}

export default function CreateCredential() {
  const { onGoBack, onSave } = useCreateCredential();

  return (
    <FormProvider>
      <ApplicationStudioLayout
        title="New credentials"
        description="Set a name, SIP username, and password. Agents and trunks pick this when they sign in."
        onBack={onGoBack}
        backLabel="Back to credentials"
        sideHint="Save after you set the username and password."
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
        <CreateCredentialForm onSubmit={onSave} />
      </ApplicationStudioLayout>
    </FormProvider>
  );
}
