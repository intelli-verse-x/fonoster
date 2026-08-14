/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/create-secret.page";
import { FormProvider } from "~/core/contexts/form-context";
import { FormSubmitButton } from "~/core/components/design-system/ui/form-submit-button/form-submit-button";
import { CreateSecretForm } from "./create-secret.form";
import { useCreateSecret } from "./create-secret.hook";
import { PRODUCT_NAME } from "~/core/brand/product";
import {
  ApplicationStudioLayout,
  studioActionButtonSx
} from "~/applications/pages/create-application/application-studio-layout";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Create secret | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "Store an encrypted value that apps and APIs in this workspace can use."
    }
  ];
}

export default function CreateSecret() {
  const { onGoBack, onSave } = useCreateSecret();

  return (
    <FormProvider>
      <ApplicationStudioLayout
        title="New secret"
        description="Give it a name, then store text or JSON. Only this workspace can use it."
        onBack={onGoBack}
        backLabel="Back to secrets"
        sideHint="Save after you set the name and value. The list never shows the value."
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
        <CreateSecretForm onSubmit={onSave} />
      </ApplicationStudioLayout>
    </FormProvider>
  );
}
