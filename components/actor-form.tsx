"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";

export const ActorForm = ({ guest }: { guest?: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    bio: "",
    gender: "",
    age: "",
    type: guest ? "GUEST" : "MAIN",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/actors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age, 10) || null,
          userId: session?.user?.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Redirect to the actor page
        router.push(`/actor/${data.actor.slug}`);
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
        <Label htmlFor="firstName">Ime</Label>
        <Input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="lastName">Prezime</Label>
        <Input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="nickname">Nadimak</Label>
        <Input
          name="nickname"
          value={formData.nickname}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="bio">Biografija</Label>
        <Textarea name="bio" value={formData.bio} onChange={handleChange} />
      </div>

      <div>
        <Label htmlFor="gender">Spol</Label>

        <Select
          onValueChange={(e) =>
            handleChange({
              // TODO: Fix TS error
              // @ts-ignore
              target: { name: "gender", value: e },
            })
          }
          defaultValue={formData.gender}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Spol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Muško</SelectItem>
            <SelectItem value="female">Žensko</SelectItem>
            <SelectItem value="transgender">Transgender</SelectItem>
            <SelectItem value="other">Drugi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="age">Starost</Label>
        <Input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading
          ? "Submitting..."
          : pathname === "/guest/new"
          ? "Dodaj gosta"
          : "Dodaj lika"}
      </Button>
    </form>
  );
};
