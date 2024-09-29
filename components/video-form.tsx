"use client";

import { useEffect, useState } from "react";
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
import { VideoProvider, Video, Actor, Category } from "@prisma/client";

export function VideoForm({
  video,
}: {
  video?: Video & { actors?: Actor[]; categories?: Category[] };
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<
    Video & {
      actors?: string[];
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
      actors: video?.actors?.map((actor) => actor.id) || [],
      categories: video?.categories?.map((category) => category.id) || [],
    },
  });

  const [actors, setActors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(video);

  useEffect(() => {
    // Fetch actors and categories
    async function fetchData() {
      try {
        const [actorsRes, categoriesRes] = await Promise.all([
          fetch("/api/actors"),
          fetch("/api/categories"),
        ]);

        if (!actorsRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to fetch actors or categories.");
        }

        const [actorsData, categoriesData] = await Promise.all([
          actorsRes.json(),
          categoriesRes.json(),
        ]);

        setActors(actorsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error(err);
        setError("Failed to load actors or categories.");
      }
    }

    fetchData();
  }, []);

  const onSubmit = async (
    data: Video & { actors?: string[]; categories?: string[] }
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
            actors: data.actors,
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
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Title */}
      <div>
        <Label htmlFor="title">Naslov</Label>
        <Input
          id="title"
          {...register("title", { required: "Nasov je obavezan" })}
          placeholder="Upiši naslov videa"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      {/* Video ID */}
      <div>
        <Label htmlFor="videoId">Video ID</Label>
        <Input
          id="videoId"
          {...register("videoId", { required: "Video ID is required" })}
          placeholder="Enter video ID based on provider"
        />
        {errors.videoId && (
          <p className="text-red-500">{errors.videoId.message}</p>
        )}
      </div>

      {/* Duration */}
      <div>
        <Label htmlFor="duration">Duljina (u sekundama)</Label>
        <Input
          id="duration"
          type="number"
          {...register("duration", {
            required: "Duration is required",
            min: { value: 1, message: "Duration must be at least 1 second" },
          })}
          placeholder="Enter duration in seconds"
        />
        {errors.duration && (
          <p className="text-red-500">{errors.duration.message}</p>
        )}
      </div>

      {/* Aired Date */}
      <div>
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
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>

      {/* Provider */}
      <div>
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
      </div>

      <div>
        <Label htmlFor="actors">Likovi</Label>
        <Controller
          control={control}
          name="actors"
          render={({ field }) => (
            <MultiSelect
              options={actors.map((actors: any) => ({
                label: `${actors.firstName} ${actors.lastName}`,
                value: actors.id.toString(),
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
      </div>

      {/* Categories */}
      <div>
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
      </div>
      <div className="flex items-center space-x-2">
        <Controller
          control={control}
          name="published"
          render={({ field }) => (
            <Switch
              onCheckedChange={field.onChange}
              checked={field.value}
              id="published"
            />
          )}
        />
        <Label htmlFor="published">Published</Label>
      </div>

      {/* Display Server-Side Errors */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Submit and Delete Buttons */}
      <div className="flex space-x-4">
        <Button
          type="submit"
          disabled={isSubmitting || loading}
          className="flex items-center"
        >
          {isEditing ? (
            <Save className="size-4 mr-2" />
          ) : (
            <Plus className="size-4 mr-2" />
          )}
          {isSubmitting || loading
            ? "Submitting..."
            : isEditing
            ? "Ažuriraj Video"
            : "Dodaj Video"}
        </Button>

        {/* Delete Button (Visible Only When Editing) */}
        {isEditing && (
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting || loading}
            className="flex items-center"
          >
            <Trash2 className="size-4 mr-2" />
            Obriši video
          </Button>
        )}
      </div>
    </form>
  );
}
