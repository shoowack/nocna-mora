"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pageSizeConstants } from "@/app/constants/page-size-constants";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage,
  pageSize,
  totalVideos,
}: {
  currentPage: number;
  pageSize: number;
  totalVideos: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalVideos / pageSize);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", page.toString());

    router.push(`?${params.toString()}`);
  };

  const handlePageSizeChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("pageSize", value);
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex w-full items-center justify-between px-2">
      <div className="text-sm font-medium">
        {totalVideos} rezultat
        {totalVideos % 10 === 1 && totalVideos % 100 !== 11 ? "" : "a"}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Videa po stranici</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => handlePageSizeChange(value)}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeConstants.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          Stranica {currentPage} od {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => handlePageChange(1)}
            disabled={currentPage <= 1}
            size="sm"
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            size="sm"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="size-4" />
          </Button>
          {/* Page buttons */}
          {/* {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              disabled={index + 1 === currentPage}
              className={cn({
                "!opacity-100": index + 1 === currentPage,
              })}
              variant={index + 1 === currentPage ? "default" : "outline"}
              size="sm"
            >
              {index + 1}
            </Button>
          ))} */}
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            size="sm"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage >= totalPages}
            size="sm"
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
