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
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "~/core/components/design-system/forms";
import { Input } from "~/core/components/design-system/ui/input/input";
import { ResourceIdField } from "~/core/components/design-system/ui/resource-id-field/resource-id-field";
import { FormRoot } from "~/core/components/design-system/forms/form-root";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { schema, type Schema } from "./create-acl.schema";
import { Box, IconButton, Typography } from "@mui/material";
import { CreateRuleModal } from "./create-acl-rules-modal.modal";
import { ModalTrigger } from "~/core/components/general/modal-trigger";
import { useFormContextSync } from "~/core/hooks/use-form-context-sync";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

/**
 * Props interface for the CreateAclForm component.
 *
 * @property {Schema} [initialValues] - Optional initial values for editing.
 * @property {(data: Schema) => Promise<void>} onSubmit - Callback triggered on form submission.
 * @property {boolean} [isEdit] - Whether this form is for editing an existing ACL.
 */
export interface CreateAclFormProps extends React.PropsWithChildren {
  initialValues?: Schema;
  onSubmit: (data: Schema) => Promise<void>;
  isEdit?: boolean;
}

/**
 * CreateAclForm component.
 *
 * Renders a form for creating or editing an ACL (Access Control List) entry, including:
 * - A friendly name.
 * - A unified Select showing all rules (allow/deny) with their type prefixes.
 * - A ModalTrigger for adding new rules.
 *
 * Integrates:
 * - React Hook Form for state management.
 * - Zod for schema validation.
 * - FieldArray for managing dynamic rules.
 * - Modal integration for rule creation.
 *
 * @param {CreateAclFormProps} props - Props including the onSubmit handler and optional initial values.
 */
export function CreateAclForm({
  onSubmit,
  initialValues,
  isEdit
}: CreateAclFormProps) {
  /** Local state controlling the visibility of the rules modal. */
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  /** Initializes React Hook Form with Zod resolver and initial values. */
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      ref: null,
      name: "",
      rules: [],
      ...initialValues
    },
    mode: "onChange"
  });

  /** React Hook Form's useFieldArray for dynamic list of rules. */
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "rules"
  });

  /** Sync form state with FormContext */
  useFormContextSync(form, onSubmit, isEdit);

  return (
    <>
      <Form {...form}>
        <FormRoot onSubmit={form.handleSubmit(onSubmit)}>
          {isEdit && initialValues?.ref && (
            <ResourceIdField value={initialValues.ref} label="ACL ID" />
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" label="ACL name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rules"
            render={() => (
              <FormItem>
                <FormControl>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      minWidth: 0
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#8D8D8D"
                      }}
                    >
                      Network rules
                    </Typography>

                    {fields.length === 0 && (
                      <Typography sx={{ fontSize: 13, color: "base.05" }}>
                        No rules yet. Add an allow or deny IP / CIDR below.
                      </Typography>
                    )}

                    {fields.map((rule, index) => (
                      <Box
                        key={rule.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          minWidth: 0,
                          px: 1.5,
                          py: 1,
                          borderRadius: "10px",
                          border: "1px solid #333333",
                          backgroundColor: "#141A24"
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color:
                              rule.type === "allow" ? "#6EA8FF" : "#C2C2C2",
                            flexShrink: 0
                          }}
                        >
                          {rule.type}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 13,
                            color: "#fff",
                            fontWeight: 600,
                            minWidth: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {rule.name}
                        </Typography>
                        <IconButton
                          size="small"
                          aria-label={`Remove ${rule.type} ${rule.name}`}
                          onClick={() => remove(index)}
                          sx={{
                            ml: "auto",
                            color: "base.05",
                            "&:hover": { color: "#fff" }
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}

                    <ModalTrigger
                      onClick={() => setIsRulesModalOpen(true)}
                      label="Add rule"
                    />
                  </Box>
                </FormControl>
              </FormItem>
            )}
          />
        </FormRoot>
      </Form>

      {/* Modal for creating new ACL rules */}
      <CreateRuleModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        onFormSubmit={(rule) => {
          append(rule);
          setIsRulesModalOpen(false);
        }}
      />
    </>
  );
}
