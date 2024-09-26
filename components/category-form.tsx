"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CategoryFormProps {
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState(category ? category.name : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        isEditing ? `/api/categories/${category.slug}` : "/api/categories",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
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

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <Label htmlFor="name">Category Name</Label>
        <Input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading
          ? "Submitting..."
          : isEditing
          ? "Update Category"
          : "Add Category"}
      </Button>
    </form>
  );
}
