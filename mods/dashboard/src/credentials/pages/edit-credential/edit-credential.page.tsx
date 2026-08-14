/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/edit-credential.page";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FormProvider } from "~/core/contexts/form-context";
import { FormSubmitButton } from "~/core/components/design-system/ui/form-submit-button/form-submit-button";
import { CreateCredentialForm } from "../create-credential/create-credential.form";
import { toast } from "~/core/components/design-system/ui/toaster/toaster";
import { useWorkspaceId } from "~/workspaces/hooks/use-workspace-id";
import { StudioFormSkeleton } from "~/core/brand/studio-skeletons";
import {
  useCredential,
  useUpdateCredential
} from "~/credentials/services/credentials.service";
import type { Schema } from "../create-credential/create-credential.schema";
import { getErrorMessage } from "~/core/helpers/extract-error-message";
import { PRODUCT_NAME } from "~/core/brand/product";
import {
  ApplicationStudioLayout,
  studioActionButtonSx
} from "~/applications/pages/create-application/application-studio-layout";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Edit credentials | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "Change this username and password that SIP agents and trunks use to sign in."
    }
  ];
}

export default function EditCredential() {
  const workspaceId = useWorkspaceId();
  const { ref } = useParams();

  if (!ref) {
    throw new Error("Credential reference is required");
  }

  const { data, isLoading } = useCredential(ref);
  const navigate = useNavigate();

  const onGoBack = useCallback(() => {
    navigate(`/workspaces/${workspaceId}/sip-network/credentials`);
  }, [navigate, workspaceId]);

  const { mutate } = useUpdateCredential();

  const onSave = useCallback(
    async ({ name }: Schema) => {
      try {
        mutate({ name, ref });
        toast("Credential updated successfully!");
        onGoBack();
      } catch (error) {
        toast(getErrorMessage(error));
      }
    },
    [mutate, ref, onGoBack]
  );

  useEffect(() => {
    if (!isLoading && !data) {
      toast("Oops! You are trying to edit a credential that does not exist.");
      onGoBack();
    }
  }, [isLoading, data, onGoBack]);

  if (isLoading || !data) {
    return <StudioFormSkeleton />;
  }

  return (
    <FormProvider>
      <ApplicationStudioLayout
        title={data.name || "Edit credentials"}
        description="Change this username and password that SIP agents and trunks use to sign in."
        onBack={onGoBack}
        backLabel="Back to credentials"
        sideHint="Save after you change the name. Password stays the same unless you set a new one."
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
        <CreateCredentialForm
          onSubmit={onSave}
          initialValues={{ password: "", ...data }}
          isEdit={true}
        />
      </ApplicationStudioLayout>
    </FormProvider>
  );
}
