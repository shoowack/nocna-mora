"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { X } from "lucide-react";

type AuditLogFiltersProps = {
  onFilterChange?: (
    // eslint-disable-next-line no-unused-vars
    _: {
      action?: string;
      entityType?: string;
      userId?: string;
    },
  ) => void;
};

export function AuditLogFilters({ onFilterChange }: AuditLogFiltersProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<string | null>(
    null,
  );

  const actions = [
    { value: "Created", label: "Kreiran" },
    { value: "Updated", label: "Ažuriran" },
    { value: "Deleted", label: "Obrisan" },
    { value: "Approved", label: "Odobren" },
    { value: "Rejected", label: "Odbijen" },
    { value: "Comment", label: "Komentar" },
    { value: "Reacted", label: "Reakcija" },
  ];

  const entityTypes = [
    { value: "Video", label: "Video" },
    { value: "Comment", label: "Komentar" },
    { value: "Category", label: "Kategorija" },
    { value: "Participant", label: "Učesnik" },
    { value: "Image", label: "Slika" },
  ];

  const handleReset = () => {
    setSelectedAction(null);
    setSelectedEntityType(null);
    void onFilterChange?.({
      action: undefined,
      entityType: undefined,
      userId: undefined,
    });
  };

  return (
    <div className="flex flex-col gap-2 space-y-2 md:flex-row md:items-center md:space-y-0">
      <div className="flex w-full items-center gap-2">
        <Select
          value={selectedAction || undefined}
          onValueChange={(value) => {
            setSelectedAction(value);
            void onFilterChange?.({
              action: value,
              entityType: selectedEntityType ?? undefined,
              userId: undefined,
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Radnja" />
          </SelectTrigger>
          <SelectContent>
            {actions.map((action) => (
              <SelectItem key={action.value} value={action.value}>
                {action.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedEntityType || undefined}
          onValueChange={(value) => {
            setSelectedEntityType(value);
            void onFilterChange?.({
              action: selectedAction ?? undefined,
              entityType: value,
              userId: undefined,
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Vrsta entiteta" />
          </SelectTrigger>
          <SelectContent>
            {entityTypes.map((entity) => (
              <SelectItem key={entity.value} value={entity.value}>
                {entity.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedAction || selectedEntityType ? (
          <Button variant="outline" size="icon" onClick={handleReset}>
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
