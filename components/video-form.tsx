import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select"; // Assuming you have a Select component
import { Textarea } from "@/components/ui/textarea";

interface VideoFormProps {
  video?: {
    id: number;
    title: string;
    url: string;
    duration: number;
    airedDate?: string;
    provider: string;
    slug: string;
    actorIds: number[];
    categoryIds: number[];
  };
}

export function VideoForm({ video }: VideoFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: video ? video.title : "",
    url: video ? video.url : "",
    duration: video ? video.duration.toString() : "",
    airedDate: video ? video.airedDate?.split("T")[0] : "",
    provider: video ? video.provider : "",
    actorIds: video ? video.actorIds : [],
    categoryIds: video ? video.categoryIds : [],
  });
  const [actors, setActors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch actors and categories
    async function fetchData() {
      const [actorsRes, categoriesRes] = await Promise.all([
        fetch("/api/actors"),
        fetch("/api/categories"),
      ]);

      const [actorsData, categoriesData] = await Promise.all([
        actorsRes.json(),
        categoriesRes.json(),
      ]);

      setActors(actorsData);
      setCategories(categoriesData);
    }

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value, 10)
    );

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: selectedOptions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation
    if (!formData.title || !formData.url || !formData.provider) {
      setError("Title, URL, and Provider are required.");
      setLoading(false);
      return;
    }

    // Validate provider
    const validProviders = ["YOUTUBE", "VIMEO", "DAILYMOTION"];
    if (!validProviders.includes(formData.provider)) {
      setError("Invalid video provider.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        video ? `/api/videos/${video.slug}` : "/api/videos",
        {
          method: video ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            url: formData.url,
            duration: parseInt(formData.duration, 10),
            airedDate: formData.airedDate
              ? new Date(formData.airedDate).toISOString()
              : null,
            provider: formData.provider,
            actorIds: formData.actorIds,
            categoryIds: formData.categoryIds,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        router.push(video ? `/videos/${data.video.slug}` : "/videos");
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

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          name="url"
          value={formData.url}
          onChange={handleChange}
          required
          placeholder="Enter video ID or URL based on provider"
        />
      </div>

      <div>
        <Label htmlFor="duration">Duration (seconds)</Label>
        <Input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="airedDate">Aired Date</Label>
        <Input
          type="date"
          name="airedDate"
          value={formData.airedDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="provider">Provider</Label>
        <Select
          name="provider"
          value={formData.provider}
          onChange={handleChange}
          required
        >
          <option value="">Select provider</option>
          <option value="YOUTUBE">YouTube</option>
          <option value="VIMEO">Vimeo</option>
          <option value="DAILYMOTION">Dailymotion</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="actors">Actors</Label>
        <select
          name="actorIds"
          multiple
          value={formData.actorIds}
          onChange={handleMultiSelectChange}
          className="w-full border rounded p-2"
        >
          {actors.map((actor: any) => (
            <option key={actor.id} value={actor.id}>
              {actor.firstName} {actor.lastName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="categories">Categories</Label>
        <select
          name="categoryIds"
          multiple
          value={formData.categoryIds}
          onChange={handleMultiSelectChange}
          className="w-full border rounded p-2"
        >
          {categories.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : video ? "Update Video" : "Add Video"}
      </Button>
    </form>
  );
}
