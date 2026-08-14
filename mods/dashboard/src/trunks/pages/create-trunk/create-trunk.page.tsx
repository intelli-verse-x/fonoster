/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/create-trunk.page";
import { FormProvider } from "~/core/contexts/form-context";
import { FormSubmitButton } from "~/core/components/design-system/ui/form-submit-button/form-submit-button";
import { CreateTrunkForm } from "./create-trunk.form";
import { useCreateTrunk } from "./create-trunk.hook";
import { PRODUCT_NAME } from "~/core/brand/product";
import {
  ApplicationStudioLayout,
  studioActionButtonSx
} from "~/applications/pages/create-application/application-studio-layout";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Create trunk | ${PRODUCT_NAME}` },
    {
      name: "description",
      content: "Connect a phone company so Voice Studio can place and receive calls."
    }
  ];
}

export default function CreateTrunk() {
  const { onGoBack, onSave } = useCreateTrunk();

  return (
    <FormProvider>
      <ApplicationStudioLayout
        title="New trunk"
        description="A trunk is the pipe to your phone company. Inbound is calls coming in. Outbound is calls going out."
        onBack={onGoBack}
        backLabel="Back to trunks"
        sideHint="Save after you set the inbound address and outbound routes. ACL and credentials control who may use this trunk."
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
        <CreateTrunkForm onSubmit={onSave} />
      </ApplicationStudioLayout>
    </FormProvider>
  );
}
