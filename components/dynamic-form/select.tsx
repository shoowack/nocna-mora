import { FC, forwardRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export interface Option {
  label: string;
  value: string;
}

interface SelectFieldProps {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  options: Array<Option>;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

export const SelectField: FC<SelectFieldProps> = forwardRef<
  HTMLDivElement,
  SelectFieldProps
>(
  ({
    onChange,
    options,
    className,
    disabled,
    isLoading,
    placeholder,
    value,
  }) => {
    const handleChange = (selectedValue: string) => {
      onChange(selectedValue);
    };

    return (
      <Select
        onValueChange={handleChange}
        disabled={disabled ?? isLoading}
        value={value}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder ?? "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

SelectField.displayName = "SelectField";
