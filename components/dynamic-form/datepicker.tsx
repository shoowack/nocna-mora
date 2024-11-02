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
import { hr } from "date-fns/locale";
import { PropsBase, TZDate } from "react-day-picker";

type DatePickerProps = {
  className: string;
  value: string | null;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string | null) => void;
  placeholder?: string;
  captionLayout?: PropsBase["captionLayout"];
  fromYear?: number;
  toYear?: number;
  classNames?: {
    caption_label?: string;
  };
};

export const DatePicker: FC<DatePickerProps> = forwardRef<
  HTMLButtonElement,
  DatePickerProps
>(({ className, value, ...props }, ref) => {
  const timeZone = "UTC";
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
              "text-stone-500 hover:text-stone-500 dark:text-stone-400 dark:hover:text-stone-400"
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? (
            format(new TZDate(date, timeZone), "PPP", { locale: hr })
          ) : (
            <span>{props.placeholder || "Odaberi datum"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          timeZone={timeZone}
          locale={hr}
          selected={date ? new TZDate(date, timeZone) : undefined}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              setDate(new TZDate(selectedDate, timeZone));
              props.onChange(
                format(new TZDate(selectedDate, timeZone), "yyyy-MM-dd")
              );
            } else {
              setDate(null);
              props.onChange(null);
            }
          }}
          // initialFocus
          defaultMonth={date ? new TZDate(date, timeZone) : undefined}
          {...(props.captionLayout && { captionLayout: props.captionLayout })}
          {...(props.fromYear && { fromYear: props.fromYear })}
          {...(props.toYear && { toYear: props.toYear })}
          {...(props.classNames && { classNames: props.classNames })}
        />
      </PopoverContent>
    </Popover>
  );
});

DatePicker.displayName = "DatePicker";
