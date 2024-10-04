"use client";

import { FC, PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Controller, useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  // Folder,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MultiSelect } from "@/components/ui/multi-select";
import { Switch } from "@/components/ui/switch";
import { VideoProvider, Video, Participant, Category } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

const ItemGroup: FC<PropsWithChildren & { className?: string }> = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "col-span-full grid sm:grid-cols-subgrid sm:items-baseline sm:justify-items-end gap-2 sm:gap-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export function VideoForm({
  video,
}: {
  video?: Video & { participants?: Participant[]; categories?: Category[] };
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<
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
      published: video?.published || false,
      provider: video?.provider,
      participants:
        video?.participants?.map((participant) => participant.id) || [],
      categories: video?.categories?.map((category) => category.id) || [],
    },
  });

  const [participants, setParticipants] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(video);

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
    if (confirm("Are you sure you want to delete this video?")) {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-flow-row grid-cols-2 gap-x-0 gap-y-5 sm:max-w-2xl sm:gap-4 lg:max-w-3xl"
    >
      {/* Title */}
      <ItemGroup>
        <Label htmlFor="title">Naslov</Label>
        <Input
          id="title"
          {...register("title", { required: "Nasov je obavezan" })}
          placeholder="Upiši naslov videa"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </ItemGroup>

      {/* Video ID */}
      <ItemGroup>
        <Label htmlFor="videoId">Video ID</Label>
        <Input
          id="videoId"
          {...register("videoId", { required: "Video ID is required" })}
          placeholder="Enter video ID based on provider"
        />
        {errors.videoId && (
          <p className="text-red-500">{errors.videoId.message}</p>
        )}
      </ItemGroup>

      {/* Duration */}
      <ItemGroup>
        <Label htmlFor="duration">Duljina (u sekundama)</Label>
        <Input
          id="duration"
          type="number"
          {...register("duration", {
            required: "Duration is required",
            min: {
              value: 1,
              message: "Duration must be at least 1 second",
            },
          })}
          placeholder="Enter duration in seconds"
        />
        {errors.duration && (
          <p className="text-red-500">{errors.duration.message}</p>
        )}
      </ItemGroup>

      {/* Aired Date */}
      <ItemGroup>
        <Label htmlFor="airedDate">Datum emitiranja</Label>
        <Controller
          control={control}
          name="airedDate"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto size-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  // TODO: Fix TS error
                  // @ts-ignore
                  selected={field.value}
                  onSelect={(date) => field.onChange(date)}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  captionLayout="dropdown"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  classNames={
                    {
                      // caption:
                      //   "flex justify-between pt-1 relative items-center gap-2 px-2",
                      // caption_label: "text-sm font-medium capitalize",
                      // caption_dropdowns: "flex justify-center gap-2",
                    }
                  }
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </ItemGroup>

      {/* Provider */}
      <ItemGroup>
        <Label htmlFor="provider">Provider</Label>
        <Controller
          control={control}
          name="provider"
          rules={{ required: "Provider is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VideoProvider.YOUTUBE}>YouTube</SelectItem>
                <SelectItem value={VideoProvider.VIMEO}>Vimeo</SelectItem>
                <SelectItem value={VideoProvider.DAILYMOTION}>
                  Dailymotion
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.provider && (
          <p className="text-red-500">{errors.provider.message}</p>
        )}
      </ItemGroup>

      <ItemGroup>
        <Label htmlFor="participants">Likovi</Label>
        <Controller
          control={control}
          name="participants"
          render={({ field }) => (
            <MultiSelect
              options={participants.map((participants: any) => ({
                label: `${participants.firstName} ${participants.lastName}${
                  participants.nickname && ` (${participants.nickname})`
                }`,
                value: participants.id.toString(),
                // icon: ({ className }) => (
                //   <Folder className={cn("size-4", className)} />
                // ),
              }))}
              onValueChange={field.onChange}
              defaultValue={field.value}
              placeholder="Odaberi likove"
              variant="inverted"
              maxCount={5}
            />
          )}
        />
      </ItemGroup>

      {/* Categories */}
      <ItemGroup>
        <Label htmlFor="categories">Kategorije</Label>
        <Controller
          control={control}
          name="categories"
          render={({ field }) => (
            <MultiSelect
              options={categories.map((category) => ({
                label: category.title,
                value: category.id.toString(),
                // icon: ({ className }) => (
                //   <Folder className={cn("size-4", className)} />
                // ),
              }))}
              onValueChange={field.onChange}
              defaultValue={field.value}
              placeholder="Odaberi kategoriju/e"
              variant="inverted"
              maxCount={5}
            />
          )}
        />
      </ItemGroup>
      <ItemGroup className="my-4 flex items-center justify-center sm:my-0 sm:grid">
        {/* col-span-full grid sm:grid-cols-subgrid sm:items-baseline sm:justify-items-end gap-2 sm:gap-3 */}
        <Label htmlFor="published">Published</Label>
        <Controller
          control={control}
          name="published"
          render={({ field }) => (
            <Switch
              className="justify-self-start"
              onCheckedChange={field.onChange}
              checked={field.value}
              id="published"
            />
          )}
        />
      </ItemGroup>

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
              size="sm"
            >
              <Trash2 className="mr-2 size-4" />
              Obriši video
            </Button>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || loading}
            className="flex items-center"
            size="sm"
          >
            {isEditing ? (
              <Save className="mr-2 size-4" />
            ) : (
              <Plus className="mr-2 size-4" />
            )}
            {isSubmitting || loading
              ? "Submitting..."
              : isEditing
              ? "Ažuriraj Video"
              : "Dodaj Video"}
          </Button>
        </div>
      </ItemGroup>
    </form>
  );
}
