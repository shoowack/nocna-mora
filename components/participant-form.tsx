"use client";

import {
  // useEffect,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { DynamicField } from "@/components/dynamic-form/dynamic-field";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { ParticipantGender } from "@prisma/client";

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
      { value: ParticipantGender.MALE, label: "Muško" },
      { value: ParticipantGender.FEMALE, label: "Žensko" },
      { value: ParticipantGender.TRANSGENDER, label: "Transrodno" },
      { value: ParticipantGender.OTHER, label: "Ostalo" },
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

export const ParticipantForm = ({
  participantData,
  guest,
}: {
  participantData?: any;
  guest?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null); // State for backend error

  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = useSession();

  const isEditing = Boolean(participantData);

  const form = useForm({
    defaultValues: {
      firstName: participantData?.firstName || "",
      lastName: participantData?.lastName || "",
      nickname: participantData?.nickname || "",
      bio: participantData?.bio || "",
      gender: participantData?.gender || "",
      birthDate: participantData?.birthDate
        ? participantData.birthDate.toISOString()
        : "",
      deathDate: participantData?.deathDate
        ? participantData.deathDate.toISOString()
        : "",
      type: isEditing && guest ? "GUEST" : participantData?.type || "MAIN",
    },
  });

  const {
    handleSubmit,
    control,
    // setValue,
    formState: {
      // errors,
      isSubmitting,
    },
  } = form;

  // useEffect(() => {
  //   if (participantData) {
  //     Object.keys(participantData).forEach((key) => setValue(key, participantData[key]));
  //   }
  // }, [participantData, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setServerError(null);

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/participants/${participantData.slug}/edit`
        : "/api/participants";

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
          guest
            ? `/guest/${result.participant.slug}`
            : `/actor/${result.participant.slug}`
        );
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
                : isEditing &&
                  pathname === `/guest/${participantData.slug}/edit`
                ? "Ažuriraj gosta"
                : isEditing &&
                  pathname === `/actor/${participantData.slug}/edit`
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
