"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

export function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    router.push(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Input
        type="search"
        id="search"
        className="h-9"
        placeholder={placeholder}
        defaultValue={searchParams.get("query") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        prependIcon={<SearchIcon className="mr-2 size-4 stroke-stone-500" />}
      />
    </>
  );
}
