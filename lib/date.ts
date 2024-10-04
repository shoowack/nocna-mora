import { differenceInYears } from "date-fns";

export const calculateAge = (
  birthDate: Date,
  deathDate: Date | null = null
) => {
  if (!birthDate) return;

  const today = new Date();
  const birth = new Date(birthDate);
  const death = deathDate ? new Date(deathDate) : today;

  return differenceInYears(death, birth);
};
