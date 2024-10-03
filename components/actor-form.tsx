"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { DynamicField } from "@/components/dynamic-form/dynamic-field";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const formFields = [
  {
    name: "firstName",
    label: "Ime",
    type: "string",
    placeholder: "Mirko",
    required: true,
  },
  {
    name: "lastName",
    label: "Prezime",
    type: "string",
    placeholder: "Fodor",
    required: true,
  },
  {
    name: "nickname",
    label: "Nadimak",
    type: "string",
    placeholder: "Mirkec",
  },
  { name: "bio", label: "Biografija", type: "text" },
  {
    name: "gender",
    label: "Spol",
    type: "select",
    options: [
      { value: "male", label: "Muško" },
      { value: "female", label: "Žensko" },
      { value: "transgender", label: "Transrodno" },
      { value: "other", label: "Ostalo" },
    ],
    placeholder: "Odaberi spol",
    required: true,
  },
  {
    name: "birthDate",
    label: "Datum rođenja",
    type: "date",
  },
  { name: "deathDate", label: "Datum smrti (opcionalno)", type: "date" },
  {
    name: "type",
    label: "Tip",
    type: "select",
    options: [
      { value: "MAIN", label: "Glavni lik" },
      { value: "GUEST", label: "Gost" },
    ],
    required: true,
  },
];

export const ActorForm = ({
  actorData,
  guest,
}: {
  actorData?: any;
  guest?: boolean;
}) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = useSession();

  const isEditing = Boolean(actorData);

  const form = useForm({
    defaultValues: {
      firstName: actorData?.firstName || "",
      lastName: actorData?.lastName || "",
      nickname: actorData?.nickname || "",
      bio: actorData?.bio || "",
      gender: actorData?.gender || "",
      birthDate: actorData?.birthDate ? actorData.birthDate.toISOString() : "",
      deathDate: actorData?.deathDate ? actorData.deathDate.toISOString() : "",
      type: isEditing && guest ? "GUEST" : actorData?.type || "MAIN",
    },
  });

  const {
    handleSubmit,
    control,
    // setValue,
    formState: { errors, isSubmitting },
  } = form;

  // useEffect(() => {
  //   if (actorData) {
  //     Object.keys(actorData).forEach((key) => setValue(key, actorData[key]));
  //   }
  // }, [actorData, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/actors/${actorData.slug}/edit`
        : "/api/actors";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          birthDate: data.birthDate
            ? new Date(data.birthDate).toISOString()
            : null,
          deathDate: data.deathDate
            ? new Date(data.deathDate).toISOString()
            : null,
          userId: session?.user?.id,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        router.push(
          guest ? `/guest/${result.actor.slug}` : `/actor/${result.actor.slug}`
        );
      } else {
        const errorData = await response.json();
        console.error(errorData.message || "An error occurred.");
      }
    } catch (err) {
      console.error("An error occurred while submitting the form.", err);
    } finally {
      setLoading(false);
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

        {/* Submit and Delete Buttons */}
        <div
          className={cn(
            "col-span-full grid sm:grid-cols-subgrid sm:items-baseline sm:justify-items-end gap-2 sm:gap-3"
            // className
          )}
        >
          {/* Display Server-Side Errors */}
          {errors && <p className="text-red-500">{errors.message}</p>}

          <div className="flex flex-col justify-items-start gap-3 sm:flex-row">
            {/* Delete Button (Visible Only When Editing) */}
            {/* {isEditing && (
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
            )} */}

            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="flex items-center"
              size="sm"
            >
              {/* {isEditing ? (
                <Save className="mr-2 size-4" />
              ) : ( */}
              <Plus className="mr-2 size-4" />
              {/* )} */}
              {isSubmitting || loading
                ? "Spremam..."
                : isEditing && pathname === `/guest/${actorData.slug}/edit`
                ? "Ažuriraj gosta"
                : isEditing && pathname === `/actor/${actorData.slug}/edit`
                ? "Ažuriraj lika"
                : pathname === "/guest/new"
                ? "Dodaj gosta"
                : "Dodaj lika"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
