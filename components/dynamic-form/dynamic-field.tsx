// dynamic-field.tsx
import { FieldComponents } from "@/components/dynamic-form/field-components";
import { Control } from "react-hook-form";
import { FieldType } from "@/components/dynamic-form/field-components";
import { cn } from "@/lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";

interface Field {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>; // For select/multi_select types
  description?: string;
  required?: boolean;
}

interface DynamicFieldProps {
  field: Field;
  control: Control<any>;
  className?: string;
}

export const DynamicField = ({
  field,
  control,
  className,
}: DynamicFieldProps) => {
  const Component = FieldComponents[field.type]; // Lookup the component based on field type

  if (!Component) {
    return null; // Handle case where no matching component is found
  }

  return (
    <div
      className={cn(
        "col-span-full grid sm:grid-cols-subgrid sm:items-baseline sm:justify-items-end gap-2 sm:gap-3",
        className
      )}
    >
      <FormField
        key={field.name}
        name={field.name}
        control={control}
        render={({ field: controllerField }) => (
          <FormItem
            className={cn(
              "col-span-full grid gap-2 sm:grid-cols-subgrid sm:items-baseline sm:justify-items-end sm:gap-3",
              field.description ? "sm:gap-y-0" : "sm:gap-3"
            )}
          >
            <div className="flex items-start gap-2">
              <FormLabel
                htmlFor={field.name}
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  {
                    "after:content-['*'] after:text-red-500 after:ml-0.5":
                      field.required,
                  }
                )}
              >
                {field.label}
              </FormLabel>
            </div>
            <FormControl>
              <>
                <Component
                  {...controllerField}
                  placeholder={field.placeholder}
                  options={field.options}
                  className={cn(
                    field.type === "boolean" && "justify-self-start"
                  )}
                />
                <FormMessage />
                {field.description && (
                  <FormDescription className={"col-start-2 justify-self-start"}>
                    {field.description}
                  </FormDescription>
                )}
              </>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
