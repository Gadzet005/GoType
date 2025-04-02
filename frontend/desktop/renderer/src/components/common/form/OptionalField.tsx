import React from "react";
import { Field, FieldProps } from "formik";
import { Checkbox, Box, FormControl } from "@mui/material";

interface OptionalFieldProps<T = any> extends FieldProps {
  subFieldComponent: React.ComponentType<
    FieldProps<T> & {
      disabled?: boolean;
      [key: string]: any;
    }
  >;
  defaultValue: T;
  subFieldProps?: Record<string, unknown>;
  checkboxLabel?: string;
}

export const OptionalField = <T,>({
  field,
  form,
  subFieldComponent: SubField,
  defaultValue,
  subFieldProps = {},
}: OptionalFieldProps<T>) => {
  const { isSubmitting } = form;
  const fieldValue = field.value !== null ? field.value : defaultValue;
  const isDisabled = field.value === null || isSubmitting;

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmitting) return;

    const isChecked = event.target.checked;
    form.setFieldValue(field.name, isChecked ? defaultValue : null);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Checkbox
        checked={field.value !== null}
        onChange={handleCheckboxChange}
        color="primary"
        disabled={isSubmitting}
      />
      <FormControl fullWidth disabled={isDisabled}>
        <Field name={field.name}>
          {(fieldProps: FieldProps<T>) => (
            <SubField
              {...fieldProps}
              form={form}
              field={{
                ...fieldProps.field,
                value: fieldValue,
              }}
              disabled={isDisabled}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (!isDisabled) {
                  fieldProps.field.onChange(event);
                  form.setFieldValue(field.name, event.target.value);
                }
              }}
              {...subFieldProps}
            />
          )}
        </Field>
      </FormControl>
    </Box>
  );
};
