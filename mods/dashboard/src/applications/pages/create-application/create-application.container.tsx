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

import { useCallback } from "react";
import { useNavigate } from "react-router";

import { FormSubmitButton } from "~/core/components/design-system/ui/form-submit-button/form-submit-button";
import { Button } from "~/core/components/design-system/ui/button/button";
import { Tooltip } from "~/core/components/design-system/ui/tooltip/tooltip";
import { Icon } from "~/core/components/design-system/icons/icons";
import { toast } from "~/core/components/design-system/ui/toaster/toaster";

import { useWorkspaceId } from "~/workspaces/hooks/use-workspace-id";
import { CreateApplicationForm } from "./create-application.form";
import { useCreateApplication } from "~/applications/services/applications.service";
import { getErrorMessage } from "~/core/helpers/extract-error-message";
import { formatApplicationData } from "~/applications/services/format-application-data";
import { useApplicationContext } from "~/applications/stores/application.store";
import type { Form, Schema } from "./schemas/application-schema";
import { useApplicationTestCall } from "~/applications/hooks/use-test-call";
import {
  ApplicationStudioLayout,
  studioActionButtonSx
} from "./application-studio-layout";

export function CreateApplicationContainer() {
  /** The current workspace ID from route or context */
  const workspaceId = useWorkspaceId();

  /** Navigation handler */
  const navigate = useNavigate();

  /** API hook to create a new application */
  const { mutateAsync } = useCreateApplication();

  /** Access application context state */
  const { application, setApplication } = useApplicationContext();

  /** Handles navigation back to the list of applications */
  const onGoBack = useCallback(() => {
    navigate(`/workspaces/${workspaceId}/applications`, {
      viewTransition: true
    });
  }, [navigate, workspaceId]);

  /**
   * Handle successful form submission.
   * Formats and sends data to backend, updates context and UI state.
   *
   * @param data - Validated application schema
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

        const { ref } = await mutateAsync(formattedData);

        setApplication({ ref });
        toast("Application created successfully!");

        // Navigate to edit page to prevent accidental duplicates and allow further configuration
        navigate(`/workspaces/${workspaceId}/applications/${ref}/edit`, {
          viewTransition: true
        });
      } catch (error) {
        toast(getErrorMessage(error));
      }
    },
    [mutateAsync, setApplication, navigate, workspaceId]
  );

  /** Hook for managing test call state and SIP stream */
  const { onTestCall, audioRef, isCalling, isLoadingCall, isAnswered, hangup } =
    useApplicationTestCall();

  const actions = (
    <>
      <FormSubmitButton
        size="small"
        loadingText="Saving..."
        sx={studioActionButtonSx}
      >
        Save
      </FormSubmitButton>
      <Tooltip
        title={
          application?.ref
            ? "Test the application with a call"
            : "Save the application first to enable test calls"
        }
        placement="left"
      >
        <Button
          onClick={() => {
            if (!application?.ref) return;
            return isAnswered ? hangup() : onTestCall();
          }}
          variant="outlined"
          size="small"
          disabled={
            !application?.ref || isLoadingCall || (isCalling && !isAnswered)
          }
          startIcon={
            <Icon
              name="Phone"
              sx={{ fontSize: "16px !important", color: "inherit" }}
            />
          }
          sx={studioActionButtonSx}
        >
          {application?.ref
            ? isCalling && !isAnswered
              ? "Calling..."
              : isAnswered
                ? "Hangup"
                : "Test Call"
            : "Save to test call"}
        </Button>
      </Tooltip>
    </>
  );

  return (
    <>
      <ApplicationStudioLayout
        title="New voice application"
        description="Autopilot: the AI talks on the call. External: your server handles the call."
        onBack={onGoBack}
        actions={actions}
      >
        <CreateApplicationForm onSubmit={onSave} />
      </ApplicationStudioLayout>
      <audio ref={audioRef} autoPlay />
    </>
  );
}
