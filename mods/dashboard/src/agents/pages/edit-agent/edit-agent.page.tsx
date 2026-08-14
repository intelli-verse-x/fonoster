/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/edit-agent.page";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FormProvider } from "~/core/contexts/form-context";
import { FormSubmitButton } from "~/core/components/design-system/ui/form-submit-button/form-submit-button";
import { CreateAgentForm } from "../create-agent/create-agent.form";
import { toast } from "~/core/components/design-system/ui/toaster/toaster";
import { useWorkspaceId } from "~/workspaces/hooks/use-workspace-id";
import { StudioFormSkeleton } from "~/core/brand/studio-skeletons";
import { useAgent, useUpdateAgent } from "~/agents/services/agents.service";
import type { Schema } from "../create-agent/create-agent.schema";
import { getErrorMessage } from "~/core/helpers/extract-error-message";
import { PRODUCT_NAME } from "~/core/brand/product";
import {
  ApplicationStudioLayout,
  studioActionButtonSx
} from "~/applications/pages/create-application/application-studio-layout";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Edit agent | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "Change this SIP phone or app: domain, username, and credentials."
    }
  ];
}

export default function EditAgent() {
  const workspaceId = useWorkspaceId();
  const { ref } = useParams();

  if (!ref) {
    throw new Error("Agent reference is required");
  }

  const { data, isLoading } = useAgent(ref);
  const navigate = useNavigate();

  const onGoBack = useCallback(() => {
    navigate(`/workspaces/${workspaceId}/sip-network/agents`, {
      viewTransition: true
    });
  }, [navigate, workspaceId]);

  const { mutateAsync } = useUpdateAgent();

  const onSave = useCallback(
    async (formData: Schema) => {
      try {
        await mutateAsync({ ...formData, ref });
        toast("Agent updated successfully!");
        onGoBack();
      } catch (error) {
        toast(getErrorMessage(error));
      }
    },
    [mutateAsync, ref, onGoBack]
  );

  useEffect(() => {
    if (!isLoading && !data) {
      toast("Oops! You are trying to edit an agent that does not exist.");
      onGoBack();
    }
  }, [isLoading, data, onGoBack]);

  if (isLoading || !data) {
    return <StudioFormSkeleton />;
  }

  const transformedData = {
    ...data,
    domainRef: data.domain?.ref,
    credentialsRef: data.credentials?.ref
  };

  return (
    <FormProvider>
      <ApplicationStudioLayout
        title={data.name || "Edit agent"}
        description="Change this SIP phone or app: domain, username, and credentials."
        onBack={onGoBack}
        backLabel="Back to agents"
        sideHint="Save after you change the domain, username, or credentials."
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
        <CreateAgentForm
          onSubmit={onSave}
          initialValues={{
            maxContacts: 10,
            expires: 3600,
            ...transformedData
          }}
          isEdit={true}
        />
      </ApplicationStudioLayout>
    </FormProvider>
  );
}
