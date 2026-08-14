/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/edit-acl.page";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FormProvider } from "~/core/contexts/form-context";
import { FormSubmitButton } from "~/core/components/design-system/ui/form-submit-button/form-submit-button";
import { CreateAclForm } from "../create-acl/create-acl.form";
import { toast } from "~/core/components/design-system/ui/toaster/toaster";
import { useWorkspaceId } from "~/workspaces/hooks/use-workspace-id";
import { StudioFormSkeleton } from "~/core/brand/studio-skeletons";
import { useAcl, useUpdateAcl } from "~/acls/services/acls.service";
import type { Schema } from "../create-acl/create-acl.schema";
import type { Acl } from "@fonoster/types";
import { getErrorMessage } from "~/core/helpers/extract-error-message";
import { PRODUCT_NAME } from "~/core/brand/product";
import {
  ApplicationStudioLayout,
  studioActionButtonSx
} from "~/applications/pages/create-application/application-studio-layout";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Edit ACL | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "Change this list of IP or CIDR rules that allow or block SIP traffic."
    }
  ];
}

export default function EditAcl() {
  const workspaceId = useWorkspaceId();
  const { ref } = useParams();

  if (!ref) {
    throw new Error("ACL reference is required.");
  }

  const { data, isLoading } = useAcl(ref);
  const navigate = useNavigate();

  const onGoBack = useCallback(() => {
    navigate(`/workspaces/${workspaceId}/sip-network/acls`, {
      viewTransition: true
    });
  }, [navigate, workspaceId]);

  const { mutateAsync } = useUpdateAcl();

  const onSave = useCallback(
    async ({ rules, ...formData }: Schema) => {
      const deny = rules
        .filter((rule) => rule.type === "deny")
        .map(({ name }) => name);

      const allow = rules
        .filter((rule) => rule.type === "allow")
        .map(({ name }) => name);

      try {
        await mutateAsync({ ...formData, ref, deny, allow });
        toast("ACL updated successfully!");
        onGoBack();
      } catch (error) {
        toast(getErrorMessage(error));
      }
    },
    [mutateAsync, ref, onGoBack]
  );

  useEffect(() => {
    if (!isLoading && !data) {
      toast("Oops! You are trying to edit an ACL that does not exist.");
      onGoBack();
    }
  }, [isLoading, data, onGoBack]);

  const formatAclToFormValues = useCallback(
    (acl: Acl & { deny?: string[] }) => ({
      ...acl,
      rules: [
        ...acl.allow.map((name) => ({ type: "allow", name })),
        ...(acl.deny || []).map((name) => ({ type: "deny", name }))
      ] as Schema["rules"]
    }),
    []
  );

  if (isLoading || !data) {
    return <StudioFormSkeleton />;
  }

  return (
    <FormProvider>
      <ApplicationStudioLayout
        title={data.name || "Edit ACL"}
        description="Change this list of IP or CIDR rules that allow or block SIP traffic."
        onBack={onGoBack}
        backLabel="Back to ACLs"
        sideHint="Save after you add or remove allow and deny networks."
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
        <CreateAclForm
          onSubmit={onSave}
          initialValues={formatAclToFormValues(data)}
          isEdit={true}
        />
      </ApplicationStudioLayout>
    </FormProvider>
  );
}
