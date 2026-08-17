/**
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * Licensed under the MIT License.
 */
import type { Route } from "./+types/create-api-key.page";
import { FormProvider } from "~/core/contexts/form-context";
import { FormSubmitButton } from "~/core/components/design-system/ui/form-submit-button/form-submit-button";
import { CreateApiKeyForm } from "./create-api-key.form";
import { useCreateApiKey } from "./create-api-key.hook";
import { Input } from "~/core/components/design-system/ui/input/input-read-only";
import { Box, Typography } from "@mui/material";
import { PRODUCT_NAME } from "~/core/brand/product";
import {
  ApplicationStudioLayout,
  studioActionButtonSx
} from "~/applications/pages/create-application/application-studio-layout";

export function meta(_: Route.MetaArgs) {
  return [
    { title: `Create API key | ${PRODUCT_NAME}` },
    {
      name: "description",
      content:
        "Create a key that lets an app call Voice Studio APIs for this workspace."
    }
  ];
}

export default function CreateApiKey() {
  const { onGoBack, onSave, data } = useCreateApiKey();

  return (
    <FormProvider>
      <ApplicationStudioLayout
        title="New API key"
        description="Pick a role, then save. The secret access key is shown once — copy it before you leave."
        onBack={onGoBack}
        backLabel="Back to API keys"
        sideHint={
          data
            ? "Copy the secret now. You will not see it again after you leave this page."
            : "Save to create the key. The secret appears here once."
        }
        actions={
          data ? (
            <Box
              component="button"
              type="button"
              onClick={onGoBack}
              sx={{
                ...studioActionButtonSx,
                border: "none",
                cursor: "pointer",
                py: 1,
                backgroundColor: "#4C6FFF",
                color: "#fff",
                "&:hover": { backgroundColor: "#6EA8FF" }
              }}
            >
              Done
            </Box>
          ) : (
            <FormSubmitButton
              size="small"
              loadingText="Saving..."
              requireDirty={false}
              sx={studioActionButtonSx}
            >
              Save
            </FormSubmitButton>
          )
        }
      >
        {!data && <CreateApiKeyForm onSubmit={onSave} />}

        {data && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Typography sx={{ fontSize: 13, color: "base.04" }}>
              Key created. Copy both values now — the secret will not be shown
              again.
            </Typography>
            <Input label="Access key ID" value={data.accessKeyId} disabled />
            <Input
              label="Secret access key"
              value={data.accessKeySecret}
              disabled
            />
          </Box>
        )}
      </ApplicationStudioLayout>
    </FormProvider>
  );
}
