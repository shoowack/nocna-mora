import { ComponentType } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectField } from "@/components/dynamic-form/select";
import { DatePicker } from "@/components/dynamic-form/datepicker";
// import { MultiSelect } from "@/components/dynamic-form/multiselect";
import { SwitchField } from "@/components/dynamic-form/switch";

export type FieldType =
  | "string"
  | "text"
  | "integer"
  | "float"
  | "date"
  | "select"
  | "boolean"
  | "multi_select";

export const FieldComponents: Record<FieldType, ComponentType<any>> = {
  string: Input,
  text: Textarea,
  integer: Input,
  float: Input,
  date: DatePicker,
  select: SelectField,
  boolean: SwitchField,
  // multi_select: MultiSelect,
};
