import { FC, forwardRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO } from "date-fns";

type DatePickerProps = {
  className: string;
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
};

export const DatePicker: FC<DatePickerProps> = forwardRef<
  HTMLButtonElement,
  DatePickerProps
>(({ className, value, ...props }, ref) => {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!value || value === "") {
      setDate(null);
    } else {
      const initialDate = value ? parseISO(value) : null;
      setDate(initialDate);
    }
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            className,
            !date &&
              "text-neutral-500 hover:text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-400"
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? (
            format(date, "PPP")
          ) : (
            <span>{props.placeholder || "Odaberi datum"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date ? new Date(date) : undefined}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
              props.onChange(format(selectedDate, "yyyy-MM-dd"));
            } else {
              setDate(null);
              props.onChange(null);
            }
          }}
          initialFocus
          defaultMonth={date ? new Date(date) : undefined}
        />
      </PopoverContent>
    </Popover>
  );
});

DatePicker.displayName = "DatePicker";
