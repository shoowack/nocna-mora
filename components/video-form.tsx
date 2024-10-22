"use client";

import { FC, PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoProvider, Video, Participant, Category } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { DynamicField } from "./dynamic-form/dynamic-field";
import { useForm, FormProvider } from "react-hook-form";

const ItemGroup: FC<PropsWithChildren & { className?: string }> = ({
  className,
  children,
}) => (
  <div
    className={cn(
      "col-span-full grid sm:grid-cols-subgrid sm:items-baseline sm:justify-items-end gap-2 sm:gap-3",
      className
    )}
  >
    {children}
  </div>
);

export function VideoForm({
  video,
}: {
  video?: Video & { participants?: Participant[]; categories?: Category[] };
}) {
  const router = useRouter();

  const form = useForm<
    Video & {
      participants?: string[];
      categories?: string[];
    }
  >({
    defaultValues: {
      title: video?.title || "",
      videoId: video?.videoId || "",
      duration: video?.duration || 0,
      airedDate: video?.airedDate ? new Date(video.airedDate) : null,
      provider: video?.provider,
      participants:
        video?.participants?.map((participant) => participant.id) || [],
      categories: video?.categories?.map((category) => category.id) || [],
      published: video?.published || false,
    },
  });

  const {
    handleSubmit,
    control,
    // setValue,
    formState: { isSubmitting },
  } = form;

  const [participants, setParticipants] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(video);

  const formFields = [
    {
      name: "title",
      label: "Naziv",
      type: "string",
      placeholder: "Naziv videa",
      required: true,
    },
    {
      name: "videoId",
      label: "Video ID",
      type: "string",
      placeholder: "ID videa",
      required: true,
    },
    {
      name: "duration",
      label: "Trajanje (u sek.)",
      type: "number",
      placeholder: "Trajanje videa",
      required: true,
    },
    {
      name: "airedDate",
      label: "Datum emitiranja",
      type: "date",
      placeholder: "Odaberi datum",
      required: true,
    },
    {
      name: "provider",
      label: "Video platforma",
      type: "select",
      options: Object.values(VideoProvider).map((provider) => ({
        value: provider,
        label:
          provider.charAt(0).toUpperCase() + provider.slice(1).toLowerCase(),
        icon: <X className="size-4" />,
      })),
      description: "Odaberi platformu na kojoj je video objavljen.",
      required: true,
    },
    {
      name: "participants",
      label: "Likovi",
      placeholder: "Odaberi likove",
      type: "multiselect",
      options: participants.map((participants: any) => ({
        label: `${participants.firstName} ${participants.lastName}${
          participants.nickname ? ` (${participants.nickname})` : ""
        }`,
        value: participants.id.toString(),
        // icon: ({ className }) => (
        //   <Folder className={cn("size-4", className)} />
        // ),
      })),
      description: "Odaberi likove koji se pojavljuju u videu.",
    },
    {
      name: "categories",
      label: "Kategorije",
      placeholder: "Odaberi kategoriju/e",
      type: "multiselect",
      options: categories.map((category) => ({
        label: category.title,
        value: category.id.toString(),
        // icon: ({ className }) => (
        //   <Folder className={cn("size-4", className)} />
        // ),
      })),
      description:
        "Odaberi jednu ili više kategorija koje najbolje opisuju sadržaj videa.",
    },
    {
      name: "published",
      label: "Objavljen",
      type: "boolean",
    },
  ];

  useEffect(() => {
    // Fetch participants and categories
    async function fetchData() {
      try {
        const [participantsRes, categoriesRes] = await Promise.all([
          fetch("/api/participants"),
          fetch("/api/categories"),
        ]);

        if (!participantsRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to fetch participants or categories.");
        }

        const [participantsData, categoriesData] = await Promise.all([
          participantsRes.json(),
          categoriesRes.json(),
        ]);

        setParticipants(participantsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error(err);
        setError("Failed to load participants or categories.");
      }
    }

    fetchData();
  }, []);

  const onSubmit = async (
    data: Video & { participants?: string[]; categories?: string[] }
  ) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        isEditing ? `/api/videos/${video?.id}` : "/api/videos",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.title,
            videoId: data.videoId,
            duration: Number(data.duration),
            airedDate: data.airedDate ? data.airedDate.toISOString() : null,
            provider: data.provider,
            published: data.published,
            participants: data.participants,
            categories: data.categories,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        router.push(isEditing ? `/video/${responseData.video.id}` : "/"); // TODO use /videos instead of / once it becomes available
      } else {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Jeste li sigurni da želite izbrisati ovaj videozapis?")) {
      try {
        const response = await fetch(`/api/videos/${video?.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.push("/"); // TODO: Redirect to the /videos page once it becomes available
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to delete the video.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while deleting the video.");
      }
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-flow-row grid-cols-2 gap-x-0 gap-y-5 sm:max-w-2xl sm:gap-4 lg:max-w-3xl"
      >
        {formFields.map((field) => (
          <DynamicField key={field.name} field={field} control={control} />
        ))}

        <Separator className="col-span-2 sm:mt-5 md:mt-10" />

        {/* Submit and Delete Buttons */}
        <ItemGroup>
          {/* Display Server-Side Errors */}
          <div>{error && <p className="text-red-500">{error}</p>}</div>

          <div className="flex flex-col justify-items-start gap-3 sm:flex-row">
            {/* Delete Button (Visible Only When Editing) */}
            {isEditing && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting || loading}
                className="flex items-center"
              >
                <Trash2 className="mr-2 size-4" />
                Obriši video
              </Button>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="flex items-center"
            >
              {isSubmitting || loading ? (
                <Loader2 className="mr-2 size-4 animate-spin " />
              ) : isEditing ? (
                <Save className="mr-2 size-4" />
              ) : (
                <Plus className="mr-2 size-4" />
              )}
              {isSubmitting || loading
                ? "Spremam..."
                : isEditing
                ? "Ažuriraj Video"
                : "Dodaj Video"}
            </Button>
          </div>
        </ItemGroup>
      </form>
    </FormProvider>
  );
}
