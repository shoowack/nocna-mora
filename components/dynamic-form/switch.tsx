import { FC, PropsWithChildren, forwardRef } from "react";
import { Switch } from "@/components/ui/switch";

type SwitchProps = {
  id: string;
  name: string;
  placeholder: string;
  value: boolean;
  className?: string;
  onChange: () => void;
};

export const SwitchField: FC<PropsWithChildren<SwitchProps>> = forwardRef<
  HTMLDivElement,
  SwitchProps
>(({ name, ...props }, ref) => (
  <div className={props?.className} ref={ref}>
    <Switch
      id={name}
      checked={props?.value}
      onCheckedChange={props?.onChange}
    />
  </div>
));

SwitchField.displayName = "SwitchField";
