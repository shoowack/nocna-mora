"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "./ui/multi-select";
import { useEffect, useState } from "react";

export const FilterControls = ({
  initialParticipants = [],
}: {
  initialParticipants?: string[];
}) => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [selectedParticipants, setSelectedParticipants] =
    useState<string[]>(initialParticipants);

  const [, setError] = useState<string>("");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Fetch participants
    async function fetchData() {
      try {
        const participantsRes = await fetch("/api/participants");

        if (!participantsRes.ok) {
          throw new Error("Failed to fetch participants.");
        }

        const participantsData = await participantsRes.json();

        setParticipants(participantsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load participants.");
      }
    }

    fetchData();
  }, []);

  function handleFilterChange(filterName: string, value: string | string[]) {
    const params = new URLSearchParams(searchParams);
    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.set(filterName, value.join(","));
      } else {
        params.delete(filterName);
      }
    } else {
      if (value) {
        params.set(filterName, value);
      } else {
        params.delete(filterName);
      }
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex space-x-4 items-center">
      {/* Provider Filter */}
      <Select
        defaultValue={searchParams.get("provider") ?? ""}
        onValueChange={(e) => handleFilterChange("provider", e)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={"Video servis"} />
        </SelectTrigger>
        <SelectContent>
          {/* @ts-ignore next-line */}
          <SelectItem value={undefined}>Svi servisi</SelectItem>
          <SelectItem value="YOUTUBE">YouTube</SelectItem>
          <SelectItem value="VIMEO">Vimeo</SelectItem>
          <SelectItem value="DAILYMOTION">Dailymotion</SelectItem>
        </SelectContent>
      </Select>

      {/* Duration Filter */}
      <Select
        defaultValue={searchParams.get("duration") ?? ""}
        onValueChange={(e) => handleFilterChange("duration", e)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={"Dužina videa"} />
        </SelectTrigger>
        <SelectContent>
          {/* @ts-ignore next-line */}
          <SelectItem value={undefined}>Sve dužine</SelectItem>
          <SelectItem value="short">Kratki (&lt; 20 min)</SelectItem>
          <SelectItem value="long">Dugački (&gt; 20 min)</SelectItem>
        </SelectContent>
      </Select>

      {/* Participants Filter */}
      <MultiSelect
        className="w-[370px] min-h-9 max-h-9"
        options={participants.map((participants: any) => ({
          label: `${participants.firstName} ${participants.lastName}`,
          value: participants.slug,
          // icon: ({ className }) => (
          //   <Folder className={cn("size-4", className)} />
          // ),
        }))}
        onValueChange={(e) => {
          handleFilterChange("participants", e);
          setSelectedParticipants;
        }}
        defaultValue={selectedParticipants}
        placeholder="Filtriraj likove"
        variant="inverted"
        maxCount={1}
      />
    </div>
  );
};
