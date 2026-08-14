/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/create-number.page";
import { useCallback } from "react";
import { useWorkspaceId } from "~/workspaces/hooks/use-workspace-id";
import { useNavigate } from "react-router";
import { FormProvider } from "~/core/contexts/form-context";
import { FormSubmitButton } from "~/core/components/design-system/ui/form-submit-button/form-submit-button";
import { CreateNumberForm, type Schema } from "./create-number.form";
import { toast } from "~/core/components/design-system/ui/toaster/toaster";
import { useCreateNumber } from "~/numbers/services/numbers.service";
import { COUNTRIES } from "./create-number.const";
import { nonEmptyValues } from "~/core/helpers/remove-empty-values";
import { getErrorMessage } from "~/core/helpers/extract-error-message";
import { PRODUCT_NAME } from "~/core/brand/product";
import {
  ApplicationStudioLayout,
  studioActionButtonSx
} from "~/applications/pages/create-application/application-studio-layout";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Create number | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "Add a phone number so Voice Studio can send and receive real calls."
    }
  ];
}

export default function CreateNumber() {
  const workspaceId = useWorkspaceId();
  const navigate = useNavigate();

  const onGoBack = useCallback(() => {
    navigate(`/workspaces/${workspaceId}/sip-network/numbers`, {
      viewTransition: true
    });
  }, [navigate, workspaceId]);

  const { mutateAsync } = useCreateNumber();

  const onSave = useCallback(
    async ({ country: countryIsoCode, ...data }: Schema) => {
      try {
        const country = COUNTRIES.find(({ value }) => value === countryIsoCode);

        if (!country) {
          toast("Oops! Invalid country selected.");
          return;
        }

        await mutateAsync({
          ...nonEmptyValues(data),
          country: country.label,
          countryIsoCode
        });
        toast("Number created successfully!");
        onGoBack();
      } catch (error) {
        toast(getErrorMessage(error));
      }
    },
    [mutateAsync, onGoBack]
  );

  return (
    <FormProvider>
      <ApplicationStudioLayout
        title="New number"
        description="A number is the phone line people dial. Point it at a voice app, and pick a trunk to send calls out."
        onBack={onGoBack}
        backLabel="Back to numbers"
        sideHint="Save after you set the phone (tel:+…) and the voice app that should answer."
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
        <CreateNumberForm onSubmit={onSave} />
      </ApplicationStudioLayout>
    </FormProvider>
  );
}
