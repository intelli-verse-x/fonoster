/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * This file is part of Fonoster
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { FormSubmitButton } from "~/core/components/design-system/ui/form-submit-button/form-submit-button";
import { Button } from "~/core/components/design-system/ui/button/button";
import { Icon } from "~/core/components/design-system/icons/icons";
import { toast } from "~/core/components/design-system/ui/toaster/toaster";

import { useWorkspaceId } from "~/workspaces/hooks/use-workspace-id";
import { CreateApplicationForm } from "../create-application/create-application.form";
import {
  useApplication,
  useUpdateApplication
} from "~/applications/services/applications.service";
import { getErrorMessage } from "~/core/helpers/extract-error-message";
import { formatApplicationData } from "~/applications/services/format-application-data";
import type {
  Form,
  Schema
} from "../create-application/schemas/application-schema";
import { StudioFormSkeleton } from "~/core/brand/studio-skeletons";
import { useApplicationTestCall } from "~/applications/hooks/use-test-call";
import { useApplicationContext } from "~/applications/stores/application.store";
import {
  ApplicationStudioLayout,
  studioActionButtonSx
} from "../create-application/application-studio-layout";

export function EditApplicationContainer() {
  /** Workspace context for routing. */
  const workspaceId = useWorkspaceId();

  /** Extract application reference from route. */
  const { ref } = useParams();

  /** Ref is required for fetch and update. Fail early if missing. */
  if (!ref) {
    throw new Error("Application reference is required");
  }

  /** Fetch the application by ref. */
  const { data, isLoading } = useApplication(ref);

  /** Mutation hook for submitting updates. */
  const { mutateAsync } = useUpdateApplication();

  /** Programmatic navigation hook. */
  const navigate = useNavigate();

  /** Application context setter. */
  const { setApplication } = useApplicationContext();

  /** Navigates back to applications list. */
  const onGoBack = useCallback(() => {
    navigate(`/workspaces/${workspaceId}/applications`, {
      viewTransition: true
    });
  }, [navigate, workspaceId]);

  /**
   * Form submission handler for updating application.
   *
   * @param data - Validated schema input from form
   */
  const onSave = useCallback(
    async ({ intelligence, ...data }: Schema, form: Form) => {
      try {
        const formattedData = formatApplicationData(
          { intelligence, ...data },
          form
        );

        if (!formattedData) {
          // If formatApplicationData sets an error, it will return undefined
          return;
        }

        await mutateAsync({ ...formattedData, ref });

        toast("Application updated successfully!");
      } catch (error) {
        console.error(error);
        toast(getErrorMessage(error));
      }
    },
    [mutateAsync, ref]
  );

  /** Set current application context on load. */
  useEffect(() => {
    setApplication({ ref });
  }, [ref]);

  /** Initialize SIP test call logic. */
  const { onTestCall, audioRef, isCalling, isLoadingCall, isAnswered, hangup } =
    useApplicationTestCall();

  /** Show error and redirect if application was not found. */
  useEffect(() => {
    if (!isLoading && !data) {
      toast("Oops! You are trying to edit an application that does not exist.");
      onGoBack();
    }
  }, [isLoading, data, onGoBack]);

  /** Show splash screen during loading. */
  if (isLoading || !data) {
    return <StudioFormSkeleton />;
  }

  const actions = (
    <>
      <FormSubmitButton
        size="small"
        loadingText="Saving..."
        sx={studioActionButtonSx}
      >
        Save
      </FormSubmitButton>
      <Button
        onClick={isAnswered ? hangup : onTestCall}
        variant="outlined"
        size="small"
        disabled={isLoadingCall || (isCalling && !isAnswered)}
        startIcon={
          <Icon
            name="Phone"
            sx={{ fontSize: "16px !important", color: "inherit" }}
          />
        }
        sx={studioActionButtonSx}
      >
        {isCalling && !isAnswered
          ? "Calling..."
          : isAnswered
            ? "Hangup"
            : "Test Call"}
      </Button>
    </>
  );

  return (
    <>
      <ApplicationStudioLayout
        title={data.name || "Edit application"}
        description="Change how this voice app talks on a live call. Autopilot uses the AI. External uses your server."
        onBack={onGoBack}
        actions={actions}
      >
        <CreateApplicationForm
          onSubmit={onSave}
          initialValues={data as Schema}
          isEdit={true}
        />
      </ApplicationStudioLayout>
      <audio ref={audioRef} autoPlay />
    </>
  );
}
