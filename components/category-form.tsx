"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2 } from "lucide-react";
import { Category } from "@prisma/client";
import { useForm, FormProvider } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { DynamicField } from "./dynamic-form/dynamic-field";

const formFields = [
  {
    name: "title",
    label: "Naziv",
    type: "string",
    placeholder: "Ime kategorije",
    required: true,
  },
];

export function CategoryForm({ category }: { category?: Category }) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null); // State for backend error

  const router = useRouter();
  const pathname = usePathname();

  const isEditing = Boolean(category);

  // Initialize React Hook Form
  const form = useForm<Category>({
    defaultValues: {
      title: category?.title || "",
    },
  });

  const {
    handleSubmit,
    control,
    register,
    // setValue,
    formState: {
      // errors,
      isSubmitting,
    },
  } = form;

  // Submit Handler
  const onSubmit = async (data: Category) => {
    setLoading(true);
    setServerError(null);

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/categories/${category?.slug}`
        : "/api/categories";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: data.title }),
      });

      if (response.ok) {
        router.push("/categories");
      } else {
        const errorData = await response.json();
        setServerError(errorData.message || "An error occurred.");
        console.error(errorData.message || "An error occurred.");
      }
    } catch (err: any) {
      setServerError(
        err.message || "An error occurred while submitting the form."
      );
      console.error("An error occurred while submitting the form.", err);
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
          setServerError(errorData.message || "Failed to delete the category.");
        }
      } catch (err) {
        console.error(err);
        setServerError("An error occurred while deleting the category.");
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
        <div
          className={cn(
            "col-span-full grid sm:grid-cols-subgrid sm:items-baseline sm:justify-items-end gap-2 sm:gap-3"
            // className
          )}
        >
          {/* Display Server-Side Errors */}
          {serverError && (
            <p className="col-span-full text-red-500">{serverError}</p>
          )}

          <div className="col-span-2 flex flex-col justify-items-start gap-3 sm:flex-row">
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
                Obriši kategoriju
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
                ? "Spremam..."
                : isEditing
                ? "Ažuriraj kategoriju"
                : "Dodaj kategoriju"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
