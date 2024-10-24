"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
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
import { Separator } from "./ui/separator";

interface CommentSectionProps {
  videoId: string;
  comments: Array<
    Pick<
      Comment,
      | "id"
      | "content"
      | "createdAt"
      | "updatedAt"
      | "approved"
      | "deletedAt"
      | "videoId"
      | "createdById"
    > & {
      createdBy: Pick<User, "name" | "email" | "image">;
    }
  >;
  isAdmin: boolean;
  user?: Pick<User, "name" | "email" | "image" | "role">;
  totalApprovedComments: number;
  totalUnapprovedComments: number;
  totalDeletedComments: number;
}

export const CommentSection = ({
  videoId,
  comments,
  isAdmin,
  user,
  totalApprovedComments,
  totalUnapprovedComments,
  totalDeletedComments,
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null); // State for backend error

  const router = useRouter();

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
          content: newComment,
        }),
      });

      if (response.ok) {
        setNewComment("");
        router.refresh(); // Refresh page to show new comment

        // router.push("/categories");
      } else {
        const errorData = await response.json();
        setServerError(errorData.message || "Failed to add comment.");
        console.error(errorData.message || "Failed to add comment.");
      }
    } catch (err: any) {
      setServerError(
        err.message || "An error occurred while submitting the comment."
      );
      console.error("An error occurred while submitting the comment.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveComment = async (commentId: string) => {
    try {
      await fetch(`/api/comments/${commentId}/approve`, {
        method: "PATCH",
      });
      router.refresh();
    } catch (error) {
      console.error("Error approving comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleRestoreComment = async (commentId: string) => {
    try {
      await fetch(`/api/comments/${commentId}/restore`, {
        method: "PATCH",
      });
      router.refresh();
    } catch (error) {
      console.error("Error restoring comment:", error);
    }
  };

  return (
    <div className="mx-4 mb-0 mt-8 md:mb-8 md:mt-10">
      {user ? (
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-end rounded-lg bg-neutral-100"
          >
            <AutosizeTextarea
              placeholder="Dodaj komentar..."
              value={newComment}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setNewComment(e.target.value)
              }
              className="w-full border-none bg-transparent px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            {/* Display Server-Side Errors */}
            {serverError && (
              <p className="col-span-full text-red-500">{serverError}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="m-4"
            >
              Dodaj komentar
            </Button>
          </form>
        </FormProvider>
      ) : (
        <div className="flex flex-col items-end rounded-lg bg-neutral-100">
          <p className="mx-4 my-3 self-start text-sm text-neutral-400">
            Prijavite se da biste dodali komentar.
          </p>
          <Button disabled className="m-4">
            Dodaj komentar
          </Button>
        </div>
      )}

      {(totalApprovedComments > 0 ||
        (isAdmin && totalUnapprovedComments > 0) ||
        (isAdmin && totalDeletedComments > 0)) && (
        <>
          <Separator className="my-8" />

          <div className="flex flex-col items-center justify-between gap-y-3 md:flex-row md:gap-y-0">
            <div className="flex flex-col items-start gap-4 self-start md:flex-row md:items-center">
              <h2 className="text-xl font-bold">Komentari</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {totalApprovedComments}
                </Badge>
                {isAdmin && totalUnapprovedComments > 0 && (
                  <Badge variant="outline" className="rounded-full">
                    Neodobreni: {totalUnapprovedComments}
                  </Badge>
                )}
                {isAdmin && totalDeletedComments > 0 && (
                  <Badge
                    variant="destructive"
                    className="rounded-full bg-red-100 text-red-800 shadow-none"
                  >
                    Obrisani: {totalDeletedComments}
                  </Badge>
                )}
              </div>
            </div>
            <Select disabled>
              <SelectTrigger className="h-7 md:w-auto">
                <SelectValue placeholder="Sortiraj" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Najnoviji</SelectItem>
                <SelectItem value="dark">Najstariji</SelectItem>
                <SelectItem value="system">Najpopularniji</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <div className="my-6 mb-0 divide-y md:divide-y-0">
        {comments.map((comment) => {
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
                    dateTime={comment.createdAt.toISOString()}
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
                      className="ml-2 bg-red-100 p-1 text-red-800 shadow-none md:px-2.5"
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
                        <DropdownMenuLabel>Opcije komentara</DropdownMenuLabel>
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
    </div>
  );
};
