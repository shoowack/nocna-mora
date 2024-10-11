import { ComponentType } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectField } from "@/components/dynamic-form/select";
import { DatePicker } from "@/components/dynamic-form/datepicker";
import { MultiSelect } from "@/components/ui/multi-select";
import { SwitchField } from "@/components/dynamic-form/switch";

export type FieldType =
  | string
  | "text"
  | "number"
  | "float"
  | "date"
  | "select"
  | "boolean"
  | "multiselect";

export const FieldComponents: Record<FieldType, ComponentType<any>> = {
  string: Input,
  text: Textarea,
  number: Input,
  float: Input,
  date: DatePicker,
  select: SelectField,
  boolean: SwitchField,
  multiselect: MultiSelect,
};
