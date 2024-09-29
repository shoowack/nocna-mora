"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Plus, Save, Trash2 } from "lucide-react";
import { Category } from "@prisma/client";

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Category>({
    defaultValues: {
      title: category?.title || "",
    },
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(category);

  // Submit Handler
  const onSubmit = async (data: Category) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        isEditing ? `/api/categories/${category?.slug}` : "/api/categories",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: data.title }),
        }
      );

      if (response.ok) {
        router.push("/categories");
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

  // Delete Handler
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/categories/${category?.slug}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.push("/categories");
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to delete the category.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while deleting the category.");
      }
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Title Field */}
      <div>
        <Label htmlFor="title">Naziv</Label>
        <Input
          id="title"
          {...register("title", { required: "Title is required" })}
          placeholder="Unesite naziv kategorije"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
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
            ? "Ažuriraj kategoriju"
            : "Dodaj kategoriju"}
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
            Obriši kategoriju
          </Button>
        )}
      </div>
    </form>
  );
}
