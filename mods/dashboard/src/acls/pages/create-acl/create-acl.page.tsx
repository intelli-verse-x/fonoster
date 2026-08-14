/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/create-acl.page";
import { FormProvider } from "~/core/contexts/form-context";
import { FormSubmitButton } from "~/core/components/design-system/ui/form-submit-button/form-submit-button";
import { CreateAclForm } from "./create-acl.form";
import { useCreateAcl } from "./create-acl.hook";
import { PRODUCT_NAME } from "~/core/brand/product";
import {
  ApplicationStudioLayout,
  studioActionButtonSx
} from "~/applications/pages/create-application/application-studio-layout";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Create ACL | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "Add IP or CIDR rules that allow or block who can reach your SIP network."
    }
  ];
}

export default function CreateAcl() {
  const { onGoBack, onSave } = useCreateAcl();

  return (
    <FormProvider>
      <ApplicationStudioLayout
        title="New ACL"
        description="Name this list, then add allow and deny networks (IP or CIDR)."
        onBack={onGoBack}
        backLabel="Back to ACLs"
        sideHint="Save after you add at least one allow or deny rule."
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
        <CreateAclForm onSubmit={onSave} />
      </ApplicationStudioLayout>
    </FormProvider>
  );
}
