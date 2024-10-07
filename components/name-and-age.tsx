import { differenceInYears, format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ParticipantGender } from "@prisma/client";

export const NameAndAge = ({
  birthDate,
  deathDate,
  gender,
  firstName,
  lastName,
  nickname,
}: {
  birthDate: Date | null;
  deathDate?: Date | null;
  gender: ParticipantGender | null;
  firstName: string;
  lastName: string;
  nickname: string | null;
}) => {
  if (!birthDate)
    return `${firstName} ${lastName} ${nickname ? ` - ${nickname}` : ""}`;

  const today = new Date();
  const birth = new Date(birthDate);
  const death = deathDate ? new Date(deathDate) : today;

  const age = differenceInYears(death, birth);

  const todaysMonthAndDay = format(today, "MM-dd");
  const birthdayMonthAndDay = format(birth, "MM-dd");

  const isBirthdayToday = todaysMonthAndDay === birthdayMonthAndDay;

  const tooltipMessage = `Danas ${
    gender === ParticipantGender.FEMALE ? `joj` : `mu`
  } je rođendan!`;

  return (
    <>
      {firstName} {lastName} {nickname ? ` - ${nickname}` : ""}
      {birthDate && !isBirthdayToday ? (
        ` (${age})`
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="ml-1">{`(${age} 🎂`})</TooltipTrigger>
            <TooltipContent>{tooltipMessage}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};
