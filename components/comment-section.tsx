"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { Button } from "./ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { formatDistance } from "date-fns";
import { hr } from "date-fns/locale/hr";
import { User, Comment } from "@prisma/client";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import {
  Check,
  Clock,
  Dot,
  MoreVertical,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "use-debounce";
import { pageSizeConstants } from "@/app/constants/page-size-constants";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

interface CommentSectionProps {
  videoId: string;
  isAdmin: boolean;
  user?: Pick<User, "name" | "email" | "image" | "role">;
}

export const CommentSection = ({
  videoId,
  isAdmin,
  user,
}: CommentSectionProps) => {
  const [data, setData] = useState<{
    comments: Array<
      Comment & {
        createdBy: Pick<User, "name" | "email" | "image" | "role">;
      }
    >;
    totalPages: number;
    totalApprovedComments: number;
    totalUnapprovedComments: number;
    totalDeletedComments: number;
    totalUnapprovedCommentsForUser: number;
  }>({
    comments: [],
    totalPages: 1,
    totalApprovedComments: 0,
    totalUnapprovedComments: 0,
    totalDeletedComments: 0,
    totalUnapprovedCommentsForUser: 0,
  });
  const [newComment, setNewComment] = useState("");
  const [debouncedComment] = useDebounce(newComment, 300);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [pageSize, setPageSize] = useState(pageSizeConstants[0]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/comments?videoId=${videoId}&page=${page}&limit=${pageSize}&sort=${sort}`
      );
      const data = await response.json();

      setData(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [page, sort, pageSize]);

  // Initialize React Hook Form
  const form = useForm<Comment>({
    defaultValues: {
      content: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // Submit Handler
  const onSubmit = async () => {
    setLoading(true);
    setServerError(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          content: debouncedComment,
        }),
      });

      if (response.ok) {
        setNewComment("");
        setPage(1); // Go back to the first page to show the new comment
        fetchComments();
      } else {
        const errorData = await response.json();
        setServerError(errorData.message || "Failed to add comment.");
      }
    } catch (err: any) {
      setServerError(
        err.message || "An error occurred while submitting the comment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApproveComment = async (commentId: string) => {
    try {
      await fetch(`/api/comments/${commentId}/approve`, {
        method: "PATCH",
      });
      fetchComments();
    } catch (error) {
      console.error("Error approving comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleRestoreComment = async (commentId: string) => {
    try {
      await fetch(`/api/comments/${commentId}/restore`, {
        method: "PATCH",
      });
      fetchComments();
    } catch (error) {
      console.error("Error restoring comment:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= data.totalPages) {
      setPage(newPage);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (newPageSize > 0) {
      setPageSize(newPageSize);
    }
  };

  return (
    <div className="mb-0 mt-4 md:mx-4 md:mb-2 md:mt-10">
      {/* Title and counters */}
      {(data.totalApprovedComments > 0 ||
        (isAdmin && data.totalUnapprovedComments > 0) ||
        (isAdmin && data.totalDeletedComments > 0)) && (
        <>
          <div className="flex flex-col items-center justify-between gap-y-3 md:flex-row md:gap-y-0">
            <div className="flex flex-col items-start gap-4 self-start md:flex-row md:items-center">
              <h2 className="text-xl font-bold">Komentari</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {data.totalApprovedComments}
                </Badge>
                {((isAdmin && data.totalUnapprovedComments > 0) ||
                  (user && data.totalUnapprovedCommentsForUser > 0)) && (
                  <Badge variant="outline" className="rounded-full">
                    Neodobreni:{" "}
                    {isAdmin
                      ? data.totalUnapprovedComments
                      : data.totalUnapprovedCommentsForUser}
                  </Badge>
                )}
                {isAdmin && data.totalDeletedComments > 0 && (
                  <Badge
                    variant="destructive"
                    className="rounded-full bg-red-100 text-red-800 shadow-none"
                  >
                    Obrisani: {data.totalDeletedComments}
                  </Badge>
                )}
              </div>
            </div>
            <Select
              onValueChange={(value) => setSort(value as "asc" | "desc")}
              defaultValue={sort}
            >
              <SelectTrigger className="h-7 md:w-auto">
                <SelectValue placeholder="Sortiraj" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Najnoviji</SelectItem>
                <SelectItem value="asc">Najstariji</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Comments */}
      <div className="my-6 mb-0 divide-y md:divide-y-0">
        {data.comments &&
          data.comments.map((comment) => {
            const isPending =
              !comment.approved && comment.createdBy.email === user?.email;

            return (
              <div key={comment.id} className="py-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <Avatar
                    className={cn(
                      "size-7 text-xs",
                      (comment.deletedAt || !comment.approved) && "opacity-50"
                    )}
                  >
                    <AvatarImage
                      src={comment.createdBy.image || "/default-avatar.png"}
                      alt={`${comment.createdBy.name} avatar`}
                    />
                    <AvatarFallback>
                      {comment.createdBy.name
                        ?.split(" ")
                        .map((name: string) => name[0].toUpperCase())
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "flex flex-col md:flex-row md:items-center flex-1 ",
                      (comment.deletedAt || !comment.approved) && "opacity-50"
                    )}
                  >
                    <span className="line-clamp-1 break-all font-semibold">
                      {comment.createdBy.name}
                    </span>
                    <Dot className="mt-px hidden min-h-5 min-w-5 text-gray-500 md:flex" />
                    <time
                      className="mt-px whitespace-nowrap text-xs  text-gray-500"
                      dateTime={new Date(comment.createdAt).toISOString()}
                    >
                      {formatDistance(comment.createdAt, new Date(), {
                        addSuffix: true,
                        locale: hr,
                      })}
                    </time>
                  </div>

                  <div className="flex items-center gap-1">
                    {!comment.approved && !comment.deletedAt && (
                      <Badge variant="secondary" className="ml-2 p-1 md:px-2.5">
                        <Clock className="size-4 md:mr-1 md:size-3" />
                        <p className="hidden md:flex">Čeka odobrenje</p>
                      </Badge>
                    )}
                    {comment.deletedAt && (
                      <Badge
                        variant="destructive"
                        className="ml-2 bg-red-100 p-1 text-red-800 shadow-none hover:bg-red-100 hover:text-red-800 md:px-2.5"
                      >
                        <Trash2 className="size-4 md:mr-1 md:size-3" />
                        <p className="hidden md:flex">Obrisan</p>
                      </Badge>
                    )}
                    {(isAdmin || isPending) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="min-h-6 p-1">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>
                            Opcije komentara
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {!comment.deletedAt && isAdmin && (
                            <DropdownMenuItem
                              onClick={() => handleApproveComment(comment.id)}
                              disabled={comment.approved}
                            >
                              <Check className="size-4" />
                              Odobri
                            </DropdownMenuItem>
                          )}
                          {(!comment.deletedAt || (!isAdmin && isPending)) && (
                            <DropdownMenuItem
                              onClick={() => handleDeleteComment(comment.id)}
                              className="!text-red-600 focus:!bg-red-100/50 dark:focus:!bg-red-950/50"
                            >
                              <Trash2 className="size-4" />
                              Izbriši
                            </DropdownMenuItem>
                          )}
                          {comment.deletedAt && isAdmin && (
                            <DropdownMenuItem
                              onClick={() => handleRestoreComment(comment.id)}
                            >
                              <RotateCcw className="size-4" />
                              Vrati
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
                <p
                  className={cn(
                    "md:ml-11",
                    (comment.deletedAt || !comment.approved) && "opacity-50"
                  )}
                >
                  {comment.content}
                </p>
              </div>
            );
          })}
      </div>

      {/* Comment Form */}
      <div className="mb-6 mt-4 md:my-10">
        {user ? (
          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex gap-x-4 md:gap-x-2"
            >
              <Avatar className={cn("size-7 text-xs")}>
                <AvatarImage
                  src={user.image || "/default-avatar.png"}
                  alt={`${user.name} avatar`}
                />
                <AvatarFallback>
                  {user.name
                    ?.split(" ")
                    .map((name: string) => name[0].toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col items-end rounded-lg bg-neutral-100">
                <AutosizeTextarea
                  placeholder="Dodaj komentar..."
                  value={newComment}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setNewComment(e.target.value)
                  }
                  className="w-full border-none bg-transparent px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                  maxLength={500}
                />
                <div className="m-2 flex w-full flex-col items-center justify-end gap-x-4 gap-y-2 md:m-4 md:flex-row">
                  {serverError && (
                    <p className="col-span-full text-balance text-center text-sm text-red-500">
                      {serverError}
                    </p>
                  )}
                  <div className="flex items-center gap-4 self-end">
                    <p className="text-sm text-gray-500">
                      {debouncedComment.length}/500 znakova
                    </p>
                    <Button type="submit" disabled={isSubmitting || loading}>
                      Dodaj komentar
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        ) : (
          <div className="flex flex-col items-end rounded-lg bg-neutral-100">
            <p className="mx-4 my-3 self-start text-sm text-neutral-400">
              Prijavite se da biste dodali komentar.
            </p>
            <Button disabled className="m-2 md:m-4">
              Dodaj komentar
            </Button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {data.comments.length > 1 && (
        <div className="flex w-full flex-col items-center justify-between gap-3 px-2 sm:flex-row">
          <div className="text-sm font-medium">
            {data.totalPages}{" "}
            {data.totalPages % 10 === 1 && data.totalPages % 100 !== 11
              ? "stranica"
              : "stranice"}
          </div>
          <div className="flex flex-col items-center gap-3 space-x-6 sm:flex-row lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Komentara po stranici</p>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => handlePageSizeChange(Number(value))}
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
            <div className="flex flex-row gap-x-2 sm:flex-row">
              <div className="flex items-center justify-center text-sm font-medium">
                Stranica {page} od {data.totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden size-8 p-0 lg:flex"
                  onClick={() => handlePageChange(1)}
                  disabled={page <= 1}
                  size="sm"
                >
                  <span className="sr-only">Go to first page</span>
                  <DoubleArrowLeftIcon className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="size-8 p-0"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  size="sm"
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="size-8 p-0"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= data.totalPages}
                  size="sm"
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 p-0 lg:flex"
                  onClick={() => handlePageChange(data.totalPages)}
                  disabled={page >= data.totalPages}
                  size="sm"
                >
                  <span className="sr-only">Go to last page</span>
                  <DoubleArrowRightIcon className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
