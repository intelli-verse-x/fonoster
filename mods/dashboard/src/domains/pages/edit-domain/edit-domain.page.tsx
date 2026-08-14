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
import type { Route } from "./+types/edit-domain.page";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FormProvider } from "~/core/contexts/form-context";
import { FormSubmitButton } from "~/core/components/design-system/ui/form-submit-button/form-submit-button";
import { CreateDomainForm } from "../create-domain/create-domain.form";
import { toast } from "~/core/components/design-system/ui/toaster/toaster";
import { useWorkspaceId } from "~/workspaces/hooks/use-workspace-id";
import { StudioFormSkeleton } from "~/core/brand/studio-skeletons";
import { useDomain, useUpdateDomain } from "~/domains/services/domains.service";
import type { Schema } from "../create-domain/create-domain.schema";
import { getErrorMessage } from "~/core/helpers/extract-error-message";
import { PRODUCT_NAME } from "~/core/brand/product";
import {
  ApplicationStudioLayout,
  studioActionButtonSx
} from "~/applications/pages/create-application/application-studio-layout";

/**
 * Sets the metadata for the "Edit Domain" page.
 *
 * This information is used by the router to define the page title and description
 * for SEO and display in the browser.
 *
 * @param _ - Meta arguments provided by the router (unused here).
 * @returns {Array} Metadata objects for the page.
 */
export function meta(_: Route.MetaArgs) {
  return [
    { title: `Edit domain | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "Change this SIP domain URI, ACL, and outbound rules."
    }
  ];
}

/**
 * EditDomain page component.
 *
 * Renders a page to edit an existing voice domain, including:
 * - Page header with back navigation and save button.
 * - A form pre-filled with the domain details.
 * - Data fetching and optimistic update integration.
 *
 * @returns {JSX.Element} The rendered Edit Domain page.
 */
export default function EditDomain() {
  /** Retrieves the current workspace ID for building navigation paths. */
  const workspaceId = useWorkspaceId();

  /** Extracts the domain reference from the URL parameters. */
  const { ref } = useParams();

  /**
   * Ensures the domain reference is provided.
   *
   * This value should never be null or undefined, as it is required
   * to fetch and update the domain data.
   */
  if (!ref) {
    throw new Error("Domain reference is required");
  }

  /** Fetches the existing domain details for editing. */
  const { data, isLoading } = useDomain(ref);

  /** Hook to programmatically navigate between pages. */
  const navigate = useNavigate();

  /**
   * Handler for navigating back to the domains page.
   * Uses `viewTransition` for smoother transitions.
   */
  const onGoBack = useCallback(() => {
    navigate(`/workspaces/${workspaceId}/sip-network/domains`, {
      viewTransition: true
    });
  }, [navigate, workspaceId]);

  /** Custom hook to handle domain updates via the API. */
  const { mutateAsync } = useUpdateDomain();

  /**
   * Handler called after form submission.
   * Updates the domain, shows a toast, and navigates back to the domains page.
   *
   * @param {Schema} data - The validated form data.
   */
  const onSave = useCallback(
    async (data: Schema) => {
      try {
        await mutateAsync({ ...data, ref });
        toast("Domain updated successfully!");
        onGoBack();
      } catch (error) {
        toast(getErrorMessage(error));
      }
    },
    [mutateAsync, ref, onGoBack]
  );

  /**
   * Effect that ensures the user is redirected if the domain does not exist.
   * Shows an error toast and navigates back to the domains page.
   */
  useEffect(() => {
    if (!isLoading && !data) {
      toast("Oops! You are trying to edit a domain that does not exist.");
      onGoBack();
    }
  }, [isLoading, data, onGoBack]);

  /**
   * Shows a loading indicator while fetching the domain data.
   */
  if (isLoading || !data) {
    return <StudioFormSkeleton />;
  }

  /**
   * Renders the Edit Domain page layout.
   */
  return (
    <FormProvider>
      <ApplicationStudioLayout
        title={data.name || "Edit domain"}
        description="Change this SIP domain URI, who can register, and outbound rules."
        onBack={onGoBack}
        backLabel="Back to domains"
        sideHint="Save after you change the URI, ACL, or outbound rules."
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
        <CreateDomainForm
          onSubmit={onSave}
          initialValues={data}
          isEdit={true}
        />
      </ApplicationStudioLayout>
    </FormProvider>
  );
}
