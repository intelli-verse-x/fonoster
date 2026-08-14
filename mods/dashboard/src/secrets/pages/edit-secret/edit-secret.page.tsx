/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/edit-secret.page";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FormProvider } from "~/core/contexts/form-context";
import { FormSubmitButton } from "~/core/components/design-system/ui/form-submit-button/form-submit-button";
import { CreateSecretForm } from "../create-secret/create-secret.form";
import { toast } from "~/core/components/design-system/ui/toaster/toaster";
import { useWorkspaceId } from "~/workspaces/hooks/use-workspace-id";
import { StudioFormSkeleton } from "~/core/brand/studio-skeletons";
import { useSecret, useUpdateSecret } from "~/secrets/services/secrets.service";
import type { Schema } from "../create-secret/create-secret.schema";
import { getErrorMessage } from "~/core/helpers/extract-error-message";
import { PRODUCT_NAME } from "~/core/brand/product";
import {
  ApplicationStudioLayout,
  studioActionButtonSx
} from "~/applications/pages/create-application/application-studio-layout";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Edit secret | ${PRODUCT_NAME}` },
    {
      name: "description",
      content: "Replace this encrypted value used by apps and APIs in this workspace."
    }
  ];
}

export default function EditSecret() {
  const workspaceId = useWorkspaceId();
  const { ref } = useParams();

  if (!ref) {
    throw new Error("Secret reference is required");
  }

  const { data, isLoading } = useSecret(ref);
  const navigate = useNavigate();

  const onGoBack = useCallback(() => {
    navigate(`/workspaces/${workspaceId}/secrets`);
  }, [navigate, workspaceId]);

  const { mutate } = useUpdateSecret();

  const onSave = useCallback(
    async (formData: Schema) => {
      try {
        mutate({ ...formData, ref });
        toast("Secret updated successfully!");
        onGoBack();
      } catch (error) {
        toast(getErrorMessage(error));
      }
    },
    [mutate, ref, onGoBack]
  );

  useEffect(() => {
    if (!isLoading && !data) {
      toast("Oops! You are trying to edit a secret that does not exist.");
      onGoBack();
    }
  }, [isLoading, data, onGoBack]);

  if (isLoading || !data) {
    return <StudioFormSkeleton />;
  }

  return (
    <FormProvider>
      <ApplicationStudioLayout
        title={data.name || "Edit secret"}
        description="Replace this encrypted value. Apps and APIs in this workspace can use the new value after you save."
        onBack={onGoBack}
        backLabel="Back to secrets"
        sideHint="Save after you change the name or value."
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
        <CreateSecretForm
          onSubmit={onSave}
          initialValues={{ ...data, type: "text" }}
          isEdit={true}
        />
      </ApplicationStudioLayout>
    </FormProvider>
  );
}
