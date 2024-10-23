"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { formatDistance } from "date-fns";
import { User, Comment } from "@prisma/client";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

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
}

export const CommentSection = ({
  videoId,
  comments,
  isAdmin,
  user,
  totalApprovedComments,
  totalUnapprovedComments,
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
    <div className="mt-10 p-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold">Komentari</h2>
        <Badge variant="secondary" className="rounded-full">
          {totalApprovedComments}
        </Badge>
        {isAdmin && totalUnapprovedComments > 0 && (
          <Badge variant="destructive" className="rounded-full">
            Neodobreni: {totalUnapprovedComments}
          </Badge>
        )}
      </div>

      {user ? (
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 flex flex-col items-end rounded-lg bg-neutral-100"
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
        <p className="mt-4 text-gray-600">
          Prijavite se da biste dodali komentar.
        </p>
      )}

      <div className="my-6 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className={cn("p-4 rounded-lg")}>
            <div
              className={cn(
                "mb-2 flex items-center gap-2",
                comment.deletedAt && "opacity-50"
              )}
            >
              <Avatar className="size-7 text-xs">
                <AvatarImage
                  src={comment.createdBy.image || "/default-avatar.png"}
                  alt={`${comment.createdBy.name} avatar`}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <span className="font-semibold">{comment.createdBy.name}</span>
              <time
                className="ml-1 mt-px text-xs text-gray-500"
                dateTime={comment.createdAt.toISOString()}
              >
                {formatDistance(comment.createdAt, new Date(), {
                  addSuffix: true,
                })}
              </time>
            </div>
            <p className={cn("ml-9", comment.deletedAt && "opacity-50")}>
              {comment.content}
            </p>
            {isAdmin && (
              <div className="mt-2 flex space-x-2">
                {!comment.deletedAt && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleApproveComment(comment.id)}
                      disabled={comment.approved}
                    >
                      Odobri
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Izbriši
                    </Button>
                  </>
                )}
                {comment.deletedAt && (
                  <Button
                    variant="secondary"
                    onClick={() => handleRestoreComment(comment.id)}
                  >
                    Vrati
                  </Button>
                )}
              </div>
            )}
            {/* {isAdmin && (
              <div className="mt-2 flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleApproveComment(comment.id)}
                  disabled={comment.approved}
                >
                  Odobri
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Izbriši
                </Button>
              </div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
};
