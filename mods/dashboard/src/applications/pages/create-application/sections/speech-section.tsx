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

import { Box } from "@mui/material";
import { Typography } from "~/core/components/design-system/ui/typography/typography";
import {
  FormField,
  FormControl,
  FormItem
} from "~/core/components/design-system/forms";
import { Select } from "~/core/components/design-system/ui/select/select";
import {
  STT_MODELS,
  LANGUAGES,
  STT_VENDORS,
  TTS_VENDORS
} from "../create-application.const";
import { VoiceSelector } from "../components";
import type { Control } from "react-hook-form";
import type { Schema } from "../schemas/application-schema";

export const SpeechSection = ({
  control,
  isAutopilot,
  ttsVendor
}: {
  control: Control<Schema>;
  isAutopilot: boolean;
  ttsVendor?: string;
}) => {
  return (
    <>
      <Box sx={{ mt: "8px" }}>
        <Typography variant="mono-medium" sx={{ color: "#fff", letterSpacing: "0.08em" }}>
          Speech
        </Typography>
        <Typography variant="body-micro" sx={{ color: "base.05" }}>
          Listens with = speech to text. Speaks with = the voice the caller hears.
        </Typography>
      </Box>

      <FormField
        control={control}
        name="speechToText.productRef"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select label="Vendor" options={STT_VENDORS} {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="speechToText.config.languageCode"
        rules={isAutopilot ? { required: true } : {}}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select label="Language" options={LANGUAGES} {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="speechToText.config.model"
        rules={isAutopilot ? { required: true } : {}}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select label="Model" options={STT_MODELS} {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <Box sx={{ mt: "8px" }}>
        <Typography variant="mono-medium" sx={{ color: "#fff", letterSpacing: "0.08em" }}>
          Speaks with
        </Typography>
        <Typography variant="body-micro" sx={{ color: "base.05" }}>
          The voice the caller hears on the line.
        </Typography>
      </Box>

      <FormField
        control={control}
        name="textToSpeech.productRef"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select label="Vendor" options={TTS_VENDORS} {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="textToSpeech.config.voice"
        rules={isAutopilot ? { required: true } : {}}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <VoiceSelector {...field} ttsVendor={ttsVendor} label="Voice" />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
