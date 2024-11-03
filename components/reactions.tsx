"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ReactionType } from "@prisma/client";
import { reactionIcons } from "@/constants/reaction-icons";
import { Info, Loader2, SmilePlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReactionProps {
  videoId: string;
  userReaction?: { id: string; type: ReactionType };
  videoReactions: { type: ReactionType; _count: number }[];
  isUserLoggedIn: boolean;
}

export const Reactions = ({
  videoId,
  userReaction,
  videoReactions,
  isUserLoggedIn,
}: ReactionProps) => {
  const [reaction, setReaction] = useState<ReactionType | undefined>(
    userReaction?.type
  );
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleReaction = async (type: ReactionType) => {
    setLoading(true);
    try {
      const response = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, type }),
      });

      if (response.ok) {
        setReaction(type);
        router.refresh(); // Refresh the page to show updated reaction count
      } else {
        console.error("Failed to add reaction.");
      }
    } catch (error) {
      console.error("Error while adding reaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveReaction = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reactions/${userReaction?.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReaction(undefined);
        router.refresh();
      } else {
        console.error("Failed to remove reaction.");
      }
    } catch (error) {
      console.error("Error while removing reaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-0 mt-2 md:mx-4 md:mb-8 md:mt-0">
      {videoReactions && (
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-stone-900">Reakcije</h3>
          {!isUserLoggedIn && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    size={18}
                    className="text-neutral-400 duration-300 hover:text-neutral-900"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Morate biti prijavljeni za dodavanje reakcije</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
      <div className="my-5 mb-4 flex gap-x-3 md:mb-0">
        {isUserLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="min-h-8 rounded-full px-2 text-neutral-500 duration-300 hover:text-neutral-900"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : (
                  <SmilePlus size={22} />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.values(ReactionType).map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => handleReaction(ReactionType[type])}
                  disabled={loading || reaction === ReactionType[type]}
                >
                  {reactionIcons[type]}
                  <p className="ml-px">
                    {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                  </p>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : videoReactions.length === 0 ? (
          <div className="flex items-center gap-2">
            {Object.values(ReactionType).map((type) => (
              <div className="rounded-full bg-neutral-100 px-2 py-1" key={type}>
                <p className="opacity-50 grayscale">{reactionIcons[type]}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex items-center gap-2">
          {videoReactions.map((reaction) =>
            userReaction?.type === reaction.type ? (
              <Button
                className={cn("rounded-full py-1 pl-2 pr-3 min-h-8")}
                variant="default"
                key={reaction.type}
                disabled={loading}
                onClick={handleRemoveReaction}
              >
                {reactionIcons[reaction.type]} {reaction._count}
              </Button>
            ) : (
              <div
                className={cn("rounded-full bg-neutral-100 py-1 pl-2 pr-3", {
                  "bg-neutral-900 text-white":
                    userReaction?.type === reaction.type,
                })}
                key={reaction.type}
                {...(userReaction?.type === reaction.type
                  ? { onClick: handleRemoveReaction }
                  : {})}
              >
                {reactionIcons[reaction.type]} {reaction._count}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
